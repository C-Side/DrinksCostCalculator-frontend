<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Drinks Management</h1>
      <router-link
        to="/"
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back to Home
      </router-link>
    </div>

    <!-- Add Drink Form -->
    <form @submit.prevent="handleSubmit" class="mb-8 p-4 border rounded">
      <input
        v-model="drinkForm.name"
        placeholder="Drink Name"
        class="border p-2 mr-2"
        required
      />
      <input
        v-model.number="drinkForm.price"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Price"
        class="border p-2 mr-2"
        required
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {{ editingDrinkId ? 'Update' : 'Add' }} Drink
      </button>
    </form>

    <!-- Drinks List -->
    <div class="space-y-4">
      <div v-for="drink in drinks" :key="drink.id" class="flex items-center justify-between p-4 border rounded">
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

<script lang="ts">
import apiClient from '@/api/axiosConfig.ts'
import type { Drink } from '@/types/Drink.ts'

export default {
  data() {
    return {
      drinks: [] as Drink[],
      drinkForm: {
        name: '',
        price: 0
      },
      editingDrinkId: null as number | null
    }
  },

  methods: {
    async fetchDrinks() {
      try {
        const response = await fetch('http://localhost:8080/api/drinks')
        this.drinks = await response.json()
      } catch (error) {
        console.error('Error fetching drinks:', error)
      }
    },

    async handleSubmit() {
      try {
        const method = this.editingDrinkId ? 'PUT' : 'POST'

        const response = await apiClient.request({
          url: '/drinks',
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(this.drinkForm)
        })

        if (response.status === 200) {
          await this.fetchDrinks()
          this.resetForm()
        }
      } catch (error) {
        console.error('Error saving drink:', error)
      }
    },

    async deleteDrink(drinkToDelete: Drink) {
      if (!confirm('Are you sure you want to delete this drink?')) return

      try {
        const response = await apiClient.delete(`/drinks`, {
          data: drinkToDelete
        })

        if (response.status === 200) {
          await this.fetchDrinks()
        }
      } catch (error) {
        console.error('Error deleting drink:', error)
      }
    },

    editDrink(drink: Drink) {
      this.drinkForm = { ...drink }
      this.editingDrinkId = drink.id
    },

    resetForm() {
      this.drinkForm = {
        name: '',
        price: 0
      }
      this.editingDrinkId = null
    }
  },

  mounted() {
    this.fetchDrinks()
  }
}
</script>
