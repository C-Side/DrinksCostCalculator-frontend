import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DrinkCategory } from '@/types/Drink.ts'
import apiClient from '@/api/axiosConfig.ts'

export const useDrinkCategoriesStore = defineStore('drinkCategories', () => {
  const drinkCategories = ref<DrinkCategory[]>([])

  async function fetchDrinkCategories() {
    if (drinkCategories.value.length > 0) return

    try {
      const response = await apiClient.get('/drink-categories')
      drinkCategories.value = response.data._embedded.drinkCategories
    } catch (error) {
      console.error('Error fetching drink categories:', error)
    }
  }

  async function addDrinkCategory(newDrinkCategory: DrinkCategory) {
    try {
      const response = await apiClient.post('/drink-categories', newDrinkCategory)
      if (response.status === 201) {
        drinkCategories.value.push(response.data)
      }
    } catch (error) {
      console.error('Error saving new drink category:', error)
    }
  }

  async function updateDrinkCategory(drinkCategoryToUpdate: DrinkCategory) {
    try {
      const response = await apiClient.put(
        `/drink-categories/${drinkCategoryToUpdate.id}`,
        drinkCategoryToUpdate,
      )
      if (response.status === 200) {
        drinkCategories.value[
          drinkCategories.value.findIndex(
            (drinkCategory: DrinkCategory) => drinkCategory.id === drinkCategoryToUpdate.id,
          )
        ] = response.data
      }
    } catch (error) {
      console.error('Error updating existing drink category:', error)
    }
  }

  async function deleteDrinkCategory(drinkCategoryToDelete: DrinkCategory) {
    try {
      const response = await apiClient.delete(`/drink-categories/${drinkCategoryToDelete.id}`)
      if (response.status === 200) {
        drinkCategories.value = drinkCategories.value.filter(
          (drinkCategory: DrinkCategory) => drinkCategory.id !== drinkCategoryToDelete.id,
        )
      }
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
