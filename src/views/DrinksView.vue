<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Drinks Management</h1>
      <router-link to="/" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        Back to Home
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="mb-8 p-4 border rounded">
      <input v-model="drinkForm.name" placeholder="Drink Name" class="border p-2 mr-2" required />
      <input
        v-model.number="drinkForm.price"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Price"
        class="border p-2 mr-2"
        required
      />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {{ drinkForm.id ? 'Update' : 'Add' }} Drink
      </button>
    </form>

    <div class="space-y-4">
      <div
        v-for="drink in store.drinks"
        :key="drink.id"
        class="flex items-center justify-between p-4 border rounded"
      >
        <div>
          <span class="font-bold">{{ drink.name }}</span>
          <span class="ml-4">${{ drink.price }}</span>
        </div>
        <div>
          <button
            @click="editDrink(drink)"
            class="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            @click="deleteDrink(drink)"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <LoadingIndicator :isLoading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDrinksStore } from '@/stores/drinksStore.ts'
import type { Drink } from '@/types/Drink.ts'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const drinkForm = ref<Drink>({ id: undefined, name: '', price: 0 })
const isLoading = ref<boolean>(false)
const store = useDrinksStore()

const handleSubmit = async () => {
  isLoading.value = true
  await store.saveDrink(drinkForm.value)
  resetForm()
  isLoading.value = false
}

const deleteDrink = async (drinkToDelete: Drink) => {
  if (!confirm('Are you sure you want to delete this drink?')) return
  isLoading.value = true
  await store.deleteDrink(drinkToDelete)
  isLoading.value = false
}

const editDrink = (drink: Drink) => {
  drinkForm.value = { ...drink }
}

const resetForm = () => {
  drinkForm.value = { id: undefined, name: '', price: 0 }
}

onMounted(() => {
  store.fetchDrinks()
})
</script>
