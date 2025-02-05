<template>
  <div class="create-person">
    <h2>Create Person</h2>
    <form @submit.prevent="createPerson" class="form">
      <input
        v-model.trim="name"
        placeholder="Enter person's name"
        :class="{ 'error': showError }"
        @input="showError = false"
      />
      <div v-if="showError" class="error-message">
        {{ errorMessage }}
      </div>
      <button
        type="submit"
        :disabled="isLoading || !name.trim()"
      >
        {{ isLoading ? 'Creating...' : 'Create' }}
      </button>
    </form>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import apiClient from '../api/axiosConfig'

export default {
  name: 'CreatePerson',
  data() {
    return {
      name: '',
      isLoading: false,
      showError: false,
      errorMessage: '',
      successMessage: '',
    }
  },
  methods: {
    async createPerson() {
      if (!this.validateInput()) {
        return
      }

      this.isLoading = true
      this.showError = false
      this.successMessage = ''

      try {
        const response = await apiClient.post('/persons', {
          name: this.name.trim(),
          drinks: []
        })

        this.successMessage = `Person created with ID: ${response.data.id}`
        this.resetForm()

        // Emit event for parent components
        this.$emit('person-created', response.data)
      } catch (error) {
        this.handleError(error)
      } finally {
        this.isLoading = false
      }
    },

    validateInput() {
      if (!this.name.trim()) {
        this.showError = true
        this.errorMessage = 'Please enter a name'
        return false
      }
      return true
    },

    handleError(error) {
      this.showError = true
      if (error.response) {
        // Handle specific API errors
        switch (error.response.status) {
          case 400:
            this.errorMessage = 'Invalid input. Please check your data.'
            break
          case 409:
            this.errorMessage = 'This person already exists.'
            break
          default:
            this.errorMessage = 'Error creating person. Please try again.'
        }
      } else if (error.request) {
        this.errorMessage = 'Network error. Please check your connection.'
      } else {
        this.errorMessage = 'An unexpected error occurred.'
      }
      console.error('Create person error:', error)
    },

    resetForm() {
      this.name = ''
      this.showError = false
      this.errorMessage = ''

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
    }
  }
}
</script>

<style scoped>
.create-person {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input.error {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  font-size: 0.875rem;
}

.success-message {
  color: #4caf50;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
