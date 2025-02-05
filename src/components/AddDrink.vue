<template>
  <div class="add-drink">
    <h2>Add Drink</h2>
    <form @submit.prevent="addDrink" class="form">
      <div class="form-group">
        <input
          v-model.trim="personId"
          placeholder="Person ID"
          :class="{ 'error': errors.personId }"
          @input="clearError('personId')"
        />
        <span v-if="errors.personId" class="error-message">{{ errors.personId }}</span>
      </div>

      <div class="form-group">
        <input
          v-model.trim="name"
          placeholder="Drink Name"
          :class="{ 'error': errors.name }"
          @input="clearError('name')"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <input
          v-model.number="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Drink Price"
          :class="{ 'error': errors.price }"
          @input="clearError('price')"
        />
        <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
      </div>

      <button
        type="submit"
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? 'Adding...' : 'Add Drink' }}
      </button>
    </form>

    <div
      v-if="successMessage"
      class="success-message"
      role="alert"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import apiClient from '../api/axiosConfig'

export default {
  name: 'AddDrink',
  data() {
    return {
      personId: '',
      name: '',
      price: '',
      isLoading: false,
      errors: {
        personId: '',
        name: '',
        price: ''
      },
      successMessage: '',
    }
  },
  computed: {
    isFormValid() {
      return this.personId.trim() &&
        this.name.trim() &&
        this.price !== '' &&
        this.price >= 0 &&
        !Object.values(this.errors).some(error => error)
    }
  },
  methods: {
    validateForm() {
      let isValid = true
      this.errors = {
        personId: '',
        name: '',
        price: ''
      }

      if (!this.personId.trim()) {
        this.errors.personId = 'Person ID is required'
        isValid = false
      }

      if (!this.name.trim()) {
        this.errors.name = 'Drink name is required'
        isValid = false
      }

      if (this.price === '') {
        this.errors.price = 'Price is required'
        isValid = false
      } else if (this.price < 0) {
        this.errors.price = 'Price cannot be negative'
        isValid = false
      }

      return isValid
    },

    clearError(field) {
      this.errors[field] = ''
    },

    resetForm() {
      this.personId = ''
      this.name = ''
      this.price = ''
      this.errors = {
        personId: '',
        name: '',
        price: ''
      }
    },

    async addDrink() {
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.successMessage = ''

      try {
        const response = await apiClient.post(
          `/persons/${this.personId.trim()}/drinks`,
          {
            name: this.name.trim(),
            price: parseFloat(this.price)
          }
        )

        this.successMessage = 'Drink added successfully!'
        this.$emit('drink-added', response.data)
        this.resetForm()

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = ''
        }, 3000)
      } catch (error) {
        this.handleError(error)
      } finally {
        this.isLoading = false
      }
    },

    handleError(error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            this.errors.personId = 'Person not found'
            break
          case 400:
            this.errors.personId = 'Invalid request data'
            break
          default:
            this.showErrorNotification('Failed to add drink. Please try again.')
        }
      } else if (error.request) {
        this.showErrorNotification('Network error. Please check your connection.')
      } else {
        this.showErrorNotification('An unexpected error occurred.')
      }
      console.error('Add drink error:', error)
    },

    showErrorNotification(message) {
      // You could replace this with a more sophisticated notification system
      alert(message)
    }
  }
}
</script>

<style scoped>
.add-drink {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
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
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #e8f5e9;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
}
</style>
