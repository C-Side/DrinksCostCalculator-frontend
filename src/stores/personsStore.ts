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
      persons.value = response.data._embedded.persons
    } catch (error) {
      console.error('Error fetching persons:', error)
    }
  }

  async function addPerson(newPerson: Person) {
    try {
      const response = await apiClient.post('/persons', newPerson)
      if (response.status === 201) {
        persons.value.push(response.data)
      }
    } catch (error) {
      console.error('Error adding new person:', error)
    }
  }

  async function updatePerson(personToUpdate: Person) {
    try {
      const response = await apiClient.put(`/persons/${personToUpdate.id}`, personToUpdate)
      if (response.status === 200) {
        persons.value[
          persons.value.findIndex((person: Person) => person.id === personToUpdate.id)
        ] = response.data
      }
    } catch (error) {
      console.error('Error saving existing person:', error)
    }
  }

  async function deletePerson(personToDelete: Person) {
    try {
      const response = await apiClient.delete(`/persons/${personToDelete.id}`)
      if (response.status === 200) {
        persons.value = persons.value.filter((person: Person) => person.id !== personToDelete.id)
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
