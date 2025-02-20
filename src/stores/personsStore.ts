import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/axiosConfig.ts'
import type { Drink } from '@/types/Drink.ts'
import type { Person } from '@/types/Person.ts'

export const useAppStore = defineStore('persons', () => {
  // State
  const drinks = ref<Drink[]>([])
  const persons = ref<Person[]>([])
  const isLoading = ref(false)

  // Actions
  async function fetchDrinks() {
    if (drinks.value.length > 0) return // Prevent redundant calls
    isLoading.value = true
    try {
      const response = await apiClient.get('/drinks')
      drinks.value = response.data
    } catch (error) {
      console.error('Error fetching drinks:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPersons() {
    if (persons.value.length > 0) return
    isLoading.value = true
    try {
      const response = await apiClient.get('/persons')
      persons.value = response.data
    } catch (error) {
      console.error('Error fetching persons:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function saveDrink(drink: Drink) {
    try {
      const method = drink.id ? 'PUT' : 'POST'
      const response = await apiClient.request({
        url: '/drinks',
        method,
        data: drink,
      })
      if (response.status === 200) {
        await fetchDrinks()
      }
    } catch (error) {
      console.error('Error saving drink:', error)
    }
  }

  async function deleteDrink(drinkId: number) {
    try {
      const response = await apiClient.delete(`/drinks/${drinkId}`)
      if (response.status === 204) {
        drinks.value = drinks.value.filter(d => d.id !== drinkId) // Remove locally
      }
    } catch (error) {
      console.error('Error deleting drink:', error)
    }
  }

  const totalDrinkCost = computed(() => {
    return drinks.value.reduce((sum, drink) => sum + drink.price, 0)
  })

  return {
    drinks,
    persons,
    isLoading,
    fetchDrinks,
    fetchPersons,
    saveDrink,
    deleteDrink,
    totalDrinkCost,
  }
})
