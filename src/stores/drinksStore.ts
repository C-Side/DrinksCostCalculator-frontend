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
      drinks.value = response.data._embedded.drinks
    } catch (error) {
      console.error('Error fetching drinks:', error)
    }
  }

  async function addDrink(newDrink: Drink) {
    try {
      const drinkToCreate = {
        name: newDrink.name,
        price: newDrink.price,
        drinkCategory: new URL(newDrink.drinkCategory._links.self.href).pathname,
      }
      const response = await apiClient.post('/drinks', drinkToCreate)
      if (response.status === 201) {
        drinks.value.push(response.data)
      }
    } catch (error) {
      console.error('Error adding new drink:', error)
    }
  }

  async function updateDrink(drinkToUpdate: Drink) {
    try {
      const response = await apiClient.put(`/drinks/${drinkToUpdate.id}`, drinkToUpdate)
      if (response.status === 200) {
        drinks.value[drinks.value.findIndex((drink: Drink) => drink.id === drinkToUpdate.id)] =
          response.data
      }
    } catch (error) {
      console.error('Error saving existing drink:', error)
    }
  }

  async function deleteDrink(drinkToDelete: Drink) {
    try {
      const response = await apiClient.delete(`/drinks/${drinkToDelete.id}`)
      if (response.status === 200) {
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
