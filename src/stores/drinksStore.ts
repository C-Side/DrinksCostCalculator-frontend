import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axiosConfig.ts'
import type { Drink } from '@/types/Drink.ts'

export const useDrinksStore = defineStore('drinks', () => {
  const drinks = ref<Drink[]>([])

  async function fetchDrinks() {
    if (drinks.value.length > 0) return

    try {
      const response = await apiClient.get('/drinks')
      drinks.value = response.data
    } catch (error) {
      console.error('Error fetching drinks:', error)
    }
  }

  async function addDrink(drink: Drink) {
    try {
      const response = await apiClient.post('/drinks', {
        data: drink,
      })
      if (response.status === 201) {
        drinks.value.push(response.data)
      }
    } catch (error) {
      console.error('Error adding new drink:', error)
    }
  }

  async function updateDrink(person: Drink) {
    try {
      const response = await apiClient.put('/drinks', {
        data: person,
      })
      if (response.status === 200) {
        drinks.value[drinks.value.findIndex((p) => p.id === person.id)] = response.data
      }
    } catch (error) {
      console.error('Error saving existing drink:', error)
    }
  }

  async function deleteDrink(drinkToDelete: Drink) {
    try {
      const response = await apiClient.delete(`/drinks`, {
        data: drinkToDelete,
      })
      if (response.status === 204) {
        drinks.value = drinks.value.filter((drink) => drink.id !== drinkToDelete.id)
      }
    } catch (error) {
      console.error('Error deleting drink:', error)
    }
  }

  return {
    drinks,
    fetchDrinks,
    addDrink,
    updateDrink,
    deleteDrink,
  }
})
