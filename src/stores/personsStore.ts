import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axiosConfig.ts'
import type { Person } from '@/types/Person.ts'

export const usePersonsStore = defineStore('persons', () => {
  const persons = ref<Person[]>([])

  async function fetchPersons() {
    if (persons.value.length > 0) return

    try {
      const response = await apiClient.get('/persons')
      persons.value = response.data
    } catch (error) {
      console.error('Error fetching Persons:', error)
    }
  }

  async function savePerson(person: Person) {
    try {
      const method = person.id ? 'PUT' : 'POST'
      const response = await apiClient.request({
        url: '/persons',
        method,
        data: person,
      })
      if (response.status === 200) {
        persons.value.push(response.data)
      }
    } catch (error) {
      console.error('Error saving PersonTypes:', error)
    }
  }

  async function deletePerson(personToDelete: Person) {
    try {
      const response = await apiClient.delete(`/persons`, {
        data: personToDelete,
      })
      if (response.status === 204) {
        persons.value = persons.value.filter((person) => person.id !== personToDelete.id)
      }
    } catch (error) {
      console.error('Error deleting PersonTypes:', error)
    }
  }

  return {
    persons,
    fetchPersons,
    savePerson,
    deletePerson,
  }
})
