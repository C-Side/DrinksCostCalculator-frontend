import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axiosConfig.ts'
import { HalApiCaller } from '@dxc-technology/halstack-client'
import type { Drink } from '@/types/Drink.ts'

export const useDrinksStore = defineStore('drinks', () => {
  const drinks = ref<Drink[]>([])
  const emptyDrink = {
    name: '',
    price: 0,
    drinkCategoryResourceUrl: '',
    drinkCategory: {
      category: '',
      alcoholic: false,
    },
  }

  async function fetchDrinks() {
    if (drinks.value.length > 0) return

    try {
      const halResponse = await HalApiCaller.get('http://localhost:8080/api/drinks').halResource
        .getItems
      const response = await apiClient.get('/drinks?projection=withCategory')
      drinks.value = response.data._embedded.drinks.map(mapResponseToModel)
      drinks.value = halResponse
    } catch (error) {
      console.error('Error fetching drinks:', error)
    }
  }

  async function addDrink(newDrink: Drink) {
    try {
      const drinkToCreate = {
        name: newDrink.name,
        price: newDrink.price,
        drinkCategory: newDrink.drinkCategoryResourceUrl,
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

  function mapResponseToModel(drinkToMap: DrinkResponse): Drink {
    return {
      id: drinkToMap.id,
      name: drinkToMap.name,
      price: drinkToMap.price,
      drinkCategoryResourceUrl: new URL(drinkToMap._links.drinkCategory.href).pathname,
      drinkCategory: undefined,
      resourceUrl: new URL(drinkToMap._links.self.href).pathname,
    }
  }

  return {
    drinks,
    emptyDrink,
    fetchDrinks,
    addDrink,
    updateDrink,
    deleteDrink,
  }
})

interface DrinkResponse {
  id?: number
  name: string
  price: number
  _links: {
    self: {
      href: string
    }
    drinkCategory: {
      href: string
    }
  }
}
