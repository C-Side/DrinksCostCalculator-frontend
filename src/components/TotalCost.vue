<template>
  <div class="total-cost">
    <h2>Total Cost</h2>
    <form @submit.prevent="getTotalCost" class="form">
      <div class="form-group">
        <label for="personId">Person ID</label>
        <input
          id="personId"
          v-model.trim="personId"
          placeholder="Enter Person ID"
          :class="{ 'error': showError }"
          @input="clearError"
        />
        <span v-if="showError" class="error-message" role="alert">
          {{ errorMessage }}
        </span>
      </div>

      <button
        type="submit"
        :disabled="isLoading || !personId.trim()"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Get Total</span>
      </button>
    </form>

    <div
      v-if="totalCost !== null && !errorMessage"
      class="result"
      role="status"
    >
      <h3>Total Cost</h3>
      <div class="cost-display">
        {{ formatCurrency(totalCost) }}
      </div>
    </div>

    <div
      v-if="lastUpdated"
      class="last-updated"
    >
      Last updated: {{ formatDateTime(lastUpdated) }}
    </div>
  </div>
</template>

<script lang="ts">
import apiClient from '../api/axiosConfig'

export default {
  name: 'TotalCost',
  data() {
    return {
      personId: '',
      totalCost: null,
      errorMessage: '',
      showError: false,
      isLoading: false,
      lastUpdated: null,
    }
  },
  methods: {
    clearError() {
      this.showError = false
      this.errorMessage = ''
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    },

    formatDateTime(date) {
      return new Intl.DateTimeFormat('de-DE', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(date))
    },

    validateInput() {
      if (!this.personId.trim()) {
        this.showError = true
        this.errorMessage = 'Please enter a valid Person ID'
        return false
      }
      return true
    },

    async getTotalCost() {
      if (!this.validateInput()) {
        return
      }

      this.isLoading = true
      this.totalCost = null
      this.clearError()

      try {
        const response = await apiClient.get(
          `/persons/${this.personId.trim()}/total`,
          {
            timeout: 5000 // 5 second timeout
          }
        )

        this.totalCost = response.data
        this.lastUpdated = new Date()

        // Emit the result for parent components
        this.$emit('cost-retrieved', {
          personId: this.personId,
          totalCost: this.totalCost
        })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.isLoading = false
      }
    },

    handleError(error) {
      this.showError = true
      this.totalCost = null

      if (error.response) {
        switch (error.response.status) {
          case 404:
            this.errorMessage = 'Person not found'
            break
          case 400:
            this.errorMessage = 'Invalid Person ID'
            break
          default:
            this.errorMessage = 'Error fetching total cost'
        }
      } else if (error.code === 'ECONNABORTED') {
        this.errorMessage = 'Request timed out. Please try again.'
      } else if (error.request) {
        this.errorMessage = 'Network error. Please check your connection.'
      } else {
        this.errorMessage = 'An unexpected error occurred.'
      }

      console.error('Total cost fetch error:', error)
    }
  }
}
</script>

<style scoped>
.total-cost {
  max-width: 400px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
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

label {
  font-weight: 600;
  color: #2c3e50;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #4caf50;
}

input.error {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

button {
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result {
  margin-top: 2rem;
  text-align: center;
}

.cost-display {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.last-updated {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
}

@media (max-width: 480px) {
  .total-cost {
    padding: 1rem;
    margin: 0.5rem;
  }

  .cost-display {
    font-size: 1.5rem;
  }
}
</style>
