import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DrinkCategory } from '@/types/Drink.ts'
import apiClient from '@/api/axiosConfig.ts'

export const useDrinkCategoriesStore = defineStore('drinkCategories', () => {
  const drinkCategories = ref<DrinkCategory[]>([])

  async function fetchDrinkCategories() {
    try {
      const response = await apiClient.get('/drink-categories')
      drinkCategories.value = response.data
    } catch (error) {
      console.error('Error fetching drink categories:', error)
    }
  }

  async function addDrinkCategory(drinkCategory: DrinkCategory) {
    try {
      const response = await apiClient.post('/drink-categories', drinkCategory)
      drinkCategories.value.push(response.data)
    } catch (error) {
      console.error('Error saving new drink category:', error)
    }
  }

  async function updateDrinkCategory(drinkCategory: DrinkCategory) {
    try {
      const response = await apiClient.put('/drink-categories', drinkCategory)
      const index = drinkCategories.value.findIndex((d) => d.id === drinkCategory.id)
      if (index !== -1) {
        drinkCategories.value[index] = response.data
      }
    } catch (error) {
      console.error('Error updating existing drink category:', error)
    }
  }

  async function deleteDrinkCategory(drinkCategory: DrinkCategory) {
    try {
      await apiClient.delete('/drink-categories', { data: drinkCategory })
      drinkCategories.value = drinkCategories.value.filter((dk) => dk.id !== drinkCategory.id)
    } catch (error) {
      console.error('Error deleting drink category:', error)
    }
  }

  return {
    drinkCategories,
    fetchDrinkCategories,
    addDrinkCategory,
    updateDrinkCategory,
    deleteDrinkCategory,
  }
})
