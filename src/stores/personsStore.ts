import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axiosConfig.ts'
import type { Drink } from '@/types/Person.ts'

export const usePersonsStore = defineStore('persons', () => {
  const persons = ref<Drink[]>([])

  async function fetchPersons() {
    if (persons.value.length > 0) return

    try {
      const response = await apiClient.get('/persons')
      persons.value = response.data
    } catch (error) {
      console.error('Error fetching persons:', error)
    }
  }

  async function addPerson(person: Drink) {
    try {
      const response = await apiClient.post('/persons', {
        data: person,
      })
      if (response.status === 201) {
        persons.value.push(response.data)
      }
    } catch (error) {
      console.error('Error adding new person:', error)
    }
  }

  async function updatePerson(person: Drink) {
    try {
      const response = await apiClient.put('/persons', {
        data: person,
      })
      if (response.status === 200) {
        persons.value[persons.value.findIndex((p) => p.id === person.id)] = response.data
      }
    } catch (error) {
      console.error('Error saving existing person:', error)
    }
  }

  async function deletePerson(personToDelete: Drink) {
    try {
      const response = await apiClient.delete(`/persons`, {
        data: personToDelete,
      })
      if (response.status === 204) {
        persons.value = persons.value.filter((person) => person.id !== personToDelete.id)
      }
    } catch (error) {
      console.error('Error deleting person:', error)
    }
  }

  return {
    persons,
    fetchPersons,
    addPerson,
    updatePerson,
    deletePerson,
  }
})
