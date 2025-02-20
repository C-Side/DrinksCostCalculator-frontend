<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
    <h2 class="text-xl font-semibold text-gray-800 text-center mb-4">Total Cost</h2>

    <form @submit.prevent="getTotalCost" class="space-y-4">
      <div>
        <label for="personId" class="block text-sm font-medium text-gray-700">Person ID</label>
        <input
          id="personId"
          v-model.trim="personId"
          placeholder="Enter Person ID"
          :class="{ 'border-red-500': showError }"
          @input="clearError"
          class="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <p v-if="showError" class="text-red-500 text-sm mt-1">{{ errorMessage }}</p>
      </div>

      <button
        type="submit"
        :disabled="isLoading || !personId"
        class="w-full py-2 px-4 rounded-lg font-semibold text-white transition disabled:bg-gray-400
               bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400"
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
import { ref } from "vue";
import apiClient from "@/api/axiosConfig";
import axios, { type AxiosError } from "axios";
import { formatCurrency, formatDateTime } from "@/util/format.ts";

const personId = ref<number | null>(null);
const totalCost = ref<number | null>(null);
const errorMessage = ref<string>("");
const showError = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const lastUpdated = ref<Date>();

const clearError = () => {
  showError.value = false;
  errorMessage.value = "";
};

const validateInput = () => {
  if (!personId.value) {
    showError.value = true;
    errorMessage.value = "Please enter a valid Person ID";
    return false;
  }
  return true;
};

const getTotalCost = async () => {
  if (!validateInput()) return;

  isLoading.value = true;
  totalCost.value = null;
  clearError();

  try {
    const response = await apiClient.get(`/persons/${personId.value}/total`, { timeout: 5000 });
    totalCost.value = response.data;
    lastUpdated.value = new Date();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleError(error);
    } else {
      console.error('Unexpected error:', error);
    }
  } finally {
    isLoading.value = false;
  }
};

const handleError = (error: AxiosError) => {
  showError.value = true;
  totalCost.value = null;

  if (error.response) {
    switch (error.response.status) {
      case 404:
        errorMessage.value = "Person not found";
        break;
      case 400:
        errorMessage.value = "Invalid Person ID";
        break;
      default:
        errorMessage.value = "Error fetching total cost";
    }
  } else if (error.code === "ECONNABORTED") {
    errorMessage.value = "Request timed out. Please try again.";
  } else if (error.request) {
    errorMessage.value = "Network error. Please check your connection.";
  } else {
    errorMessage.value = "An unexpected error occurred.";
  }
};
</script>
