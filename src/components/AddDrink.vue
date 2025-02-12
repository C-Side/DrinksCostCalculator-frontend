<template>
  <div class="add-drink">
    <h2>Add Drink</h2>
    <form @submit.prevent="addDrink" class="form">
      <div class="form-group">
        <input
          v-model.trim="personId"
          placeholder="Person ID"
          :class="{ error: errors.personId }"
          @input="clearError('personId')"
        />
        <span v-if="errors.personId" class="error-message">{{ errors.personId }}</span>
      </div>

      <div class="relative">
        <select
          v-model="selectedDrink"
          @change="handleChange"
          class="w-full p-2 border rounded"
          :disabled="isLoading"
        >
          <option value="" disabled>Select a drink</option>
          <option v-for="drink in drinks" :key="drink.id" :value="drink">
            {{ drink.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <input
          v-model.number="quantity"
          type="number"
          step="1"
          min="1"
          placeholder="Amount of Drink"
          :class="{ error: errors.quantity }"
          @input="clearError('quantity')"
        />
        <span v-if="errors.quantity" class="error-message">{{ errors.quantity }}</span>
      </div>

      <button type="submit" :disabled="isLoading || !isFormValid">
        {{ isLoading ? 'Adding...' : 'Add Drink' }}
      </button>
    </form>

    <div v-if="successMessage" class="success-message" role="alert">
      {{ successMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import apiClient from '../api/axiosConfig'
import type { Drink } from '@/types/Drink.ts'

export default {
  name: 'AddDrink',
  data() {
    return {
      personId: '' as string,
      drinks: [] as Drink[],
      selectedDrink: {} as Drink,
      quantity: 0 as number,
      searchQuery: '',
      isOpen: false,
      isLoading: false,
      errors: {
        personId: '',
        quantity: ''
      },
      successMessage: '',
    }
  },
  computed: {
    isFormValid() {
      return this.personId.trim() &&
        this.quantity >= 1 &&
        !Object.values(this.errors).some(error => error)
    },
    filteredDrinks() {
      return this.drinks.filter((drink: Drink) =>
        drink.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    validateForm() {
      let isValid = true
      this.errors = {
        personId: '',
        quantity: ''
      }

      if (!this.personId.trim()) {
        this.errors.personId = 'Person ID is required'
        isValid = false
      }

      if (this.quantity === null) {
        this.errors.quantity = 'quantity is required'
        isValid = false
      } else if (this.quantity < 1) {
        this.errors.quantity = 'quantity cannot be negative or zero'
        isValid = false
      }

      return isValid
    },

    clearError(field) {
      this.errors[field] = ''
    },

    resetForm() {
      this.personId = ''
      this.quantity = 1
      this.errors = {
        personId: '',
        quantity: ''
      }
    },

    async fetchDrinks() {
      this.isLoading = true
      try {
        const response = await apiClient.get('/drinks')
        this.drinks = response.data
      } catch (error) {
        this.handleError(error)
      } finally {
        this.isLoading = false
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
            drinkDTO: this.selectedDrink,
            quantity: this.quantity
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

    handleChange() {
      this.$emit('drink-selected', this.selectedDrink)
    },

    showErrorNotification(message) {
      // You could replace this with a more sophisticated notification system
      alert(message)
    }
  },
  mounted() {
    this.fetchDrinks()
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
