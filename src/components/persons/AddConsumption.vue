<template>
  <div class="drink-container">
    <h2>Add a drink to a person</h2>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>

    <label for="person">Select person:</label>
    <select id="person" v-model="selectedPerson">
      <option v-for="person in personsStore.persons" :key="person.id" :value="person">
        {{ person.name }}
      </option>
    </select>

    <label for="drink">Select drink:</label>
    <select id="drink" v-model="selectedDrink">
      <option v-for="drink in drinksStore.drinks" :key="drink.id" :value="drink">
        {{ drink.name }}
      </option>
    </select>

    <label for="amount">Amount:</label>
    <input id="amount" type="number" v-model="amount" min="1" />

    <button :disabled="isLoading" @click="addDrink">
      {{ isLoading ? 'Saving...' : 'Add DrinkTypes' }}
    </button>
    <loading-indicator :isLoading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import apiClient from '@/api/axiosConfig.ts'
import { usePersonsStore } from '@/stores/personsStore.ts'
import { useDrinksStore } from '@/stores/drinksStore.ts'
import type { Person } from '@/types/Person.ts'
import type { Drink } from '@/types/Drink.ts'
import LoadingIndicator from '@/components/common/LoadingIndicator.vue'

interface DrinkAddedDTO {
  drinkDTO: Drink
  quantity: number
}

const selectedPerson = ref<Person | null>(null)
const selectedDrink = ref<Drink | null>(null)
const amount = ref<number>(1)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const personsStore = usePersonsStore()
const drinksStore = useDrinksStore()

const addDrink = async () => {
  if (!selectedPerson.value || !selectedDrink.value || amount.value <= 0) {
    errorMessage.value = 'Please select a person, a drink, and enter a valid amount.'
    return
  }

  isLoading.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    const drinkAddedDTO: DrinkAddedDTO = {
      drinkDTO: selectedDrink.value,
      quantity: amount.value,
    }

    await apiClient.post(`/persons/${selectedPerson.value.id}/drinks`, drinkAddedDTO)
    successMessage.value = 'DrinkTypes successfully added!'
  } catch (error) {
    console.error('Error adding drink:', error)
    errorMessage.value = 'Failed to add drink. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  personsStore.fetchPersons()
  drinksStore.fetchDrinks()
})
</script>

<style scoped>
.drink-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

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

.error {
  color: red;
  margin-bottom: 10px;
}

.success {
  color: green;
  margin-bottom: 10px;
}
</style>
