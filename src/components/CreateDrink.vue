<template>
  <div class="create-drink">
    <h2>Create Drink</h2>
    <form @submit.prevent="createDrink" class="form">
      <div class="form-group">
        <input
          v-model.trim="name"
          placeholder="Enter drink's name"
          :class="{ error: showError }"
          @input="showError = false"
        />
        <span v-if="showError" class="error-message">
          {{ errors.name }}
        </span>
      </div>
      <div class="form-group">
        <input
          v-model.trim="price"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Enter drink's price"
          :class="{ error: showError }"
          @input="showError = false"
        />
        <span v-if="showError" class="error-message">
          {{ errors.price }}
        </span>
      </div>
      <button type="submit" :disabled="isLoading || !name.trim()">
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
  name: 'CreateDrink',
  data() {
    return {
      name: '',
      price: '',
      isLoading: false,
      showError: false,
      errors: {
        name: '',
        price: ''
      },
      successMessage: '',
    }
  },
  methods: {
    async createDrink() {
      if (!this.validateInput()) {
        return
      }

      this.isLoading = true
      this.showError = false
      this.successMessage = ''

      try {
        const response = await apiClient.post('/drinks', {
          name: this.name.trim(),
          price: this.price,
        })

        this.successMessage = `Drink created with ID: ${response.data.id}`
        this.resetForm()

        // Emit event for parent components
        this.$emit('drink-created', response.data)
      } catch (error) {
        this.handleError(error)
      } finally {
        this.isLoading = false
      }
    },

    validateInput() {
      let isValid = true
      this.errors = {
        name: '',
        price: '',
      }

      if (!this.name.trim()) {
        this.showError = true
        this.errors.name = 'Please enter a name'
        isValid = false
      }
      if (this.price === '') {
        this.errors.price = 'Price is required'
        isValid = false
      } else if (this.price < 0.01) {
        this.errors.price = 'Price cannot be negative or zero'
        isValid = false
      }
      return isValid
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
            this.errorMessage = 'This drink already exists.'
            break
          default:
            this.errorMessage = 'Error creating drink. Please try again.'
        }
      } else if (error.request) {
        this.errorMessage = 'Network error. Please check your connection.'
      } else {
        this.errorMessage = 'An unexpected error occurred.'
      }
      console.error('Create drink error:', error)
    },

    resetForm() {
      this.name = ''
      this.showError = false
      this.errorMessage = ''

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
    },
  },
}
</script>

<style scoped>
.create-drink {
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
