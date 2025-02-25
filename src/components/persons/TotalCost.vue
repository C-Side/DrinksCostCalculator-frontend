<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
    <h2 class="text-xl font-semibold text-gray-800 text-center mb-4">Total Cost</h2>

    <form @submit.prevent="getTotalCost" class="space-y-4">
      <label for="person">Select person:</label>
      <select id="person" v-model="selectedPerson">
        <option v-for="person in personsStore.persons" :key="person.id" :value="person">
          {{ person.name }}
        </option>
      </select>

      <button
        type="submit"
        :disabled="isLoading || !selectedPerson?.id"
        class="w-full py-2 px-4 rounded-lg font-semibold text-white transition disabled:bg-gray-400 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Get Total</span>
      </button>
    </form>

    <div v-if="totalCost !== null && !errorMessage" class="mt-6 text-center">
      <h3 class="text-lg font-semibold text-gray-700">Total Cost</h3>
      <div class="mt-2 text-2xl font-bold bg-gray-100 p-3 rounded-lg">
        {{ formatCurrency(totalCost) }}
      </div>
    </div>

    <p v-if="lastUpdated" class="mt-4 text-sm text-gray-500 text-center">
      Last updated: {{ formatDateTime(lastUpdated) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '@/api/axiosConfig.ts'
import { usePersonsStore } from '@/stores/personsStore.ts'
import { formatCurrency, formatDateTime } from '@/util/format.ts'
import type { Drink } from '@/types/Person.ts'
import axios, { type AxiosError } from 'axios'

const selectedPerson = ref<Drink | null>(null)
const totalCost = ref<number | null>(null)
const errorMessage = ref<string>('')
const showError = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const lastUpdated = ref<Date>()
const personsStore = usePersonsStore()

const clearError = () => {
  showError.value = false
  errorMessage.value = ''
}

const getTotalCost = async () => {
  isLoading.value = true
  totalCost.value = null
  clearError()

  try {
    const response = await apiClient.get(`/persons/${selectedPerson.value?.id}/total`, {
      timeout: 5000,
    })
    totalCost.value = response.data
    lastUpdated.value = new Date()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleError(error)
    } else {
      console.error('Unexpected error:', error)
    }
  } finally {
    isLoading.value = false
  }
}

const handleError = (error: AxiosError) => {
  showError.value = true
  totalCost.value = null

  if (error.response) {
    switch (error.response.status) {
      case 404:
        errorMessage.value = 'PersonTypes not found'
        break
      case 400:
        errorMessage.value = 'Invalid PersonTypes ID'
        break
      default:
        errorMessage.value = 'Error fetching total cost'
    }
  } else if (error.code === 'ECONNABORTED') {
    errorMessage.value = 'Request timed out. Please try again.'
  } else if (error.request) {
    errorMessage.value = 'Network error. Please check your connection.'
  } else {
    errorMessage.value = 'An unexpected error occurred.'
  }
}
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

select,
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  margin-top: 15px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
