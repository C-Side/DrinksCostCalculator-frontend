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
        {{ editingDrinkId ? 'Update' : 'Add' }} Drink
      </button>
    </form>

    <div class="space-y-4">
      <div
        v-for="drink in drinks"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api/axiosConfig.ts'
import { useAppStore } from '@/stores/drinksStore.ts'
import type { Drink } from '@/types/Drink.ts'

// Reactive variables
const drinks = ref<Drink[]>([])
const drinkForm = ref({ name: '', price: 0 })
const editingDrinkId = ref<number | null>(null)
const store = useAppStore()

// Handle form submission (Add or Update)
const handleSubmit = async () => {
  try {
    const method = editingDrinkId.value ? 'PUT' : 'POST'

    const response = await apiClient.request({
      url: '/drinks',
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(drinkForm.value),
    })

    if (response.status === 200) {
      await fetchDrinks()
      resetForm()
    }
  } catch (error) {
    console.error('Error saving drink:', error)
  }
}

// Delete a drink
const deleteDrink = async (drinkToDelete: Drink) => {
  if (!confirm('Are you sure you want to delete this drink?')) return

  try {
    const response = await apiClient.delete(`/drinks`, {
      data: drinkToDelete,
    })

    if (response.status === 200) {
      await fetchDrinks()
    }
  } catch (error) {
    console.error('Error deleting drink:', error)
  }
}

// Edit a drink
const editDrink = (drink: Drink) => {
  drinkForm.value = { ...drink }
  editingDrinkId.value = drink.id
}

// Reset the form
const resetForm = () => {
  drinkForm.value = { name: '', price: 0 }
  editingDrinkId.value = null
}

onMounted(() => {
  store.fetchDrinks()
})
</script>
