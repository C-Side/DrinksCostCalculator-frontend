<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Persons Management</h1>
      <router-link
        to="/"
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back to Home
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="mb-8 p-4 border rounded">
      <input
        v-model="personForm.name"
        placeholder="name"
        class="border p-2 mr-2"
        required
      />
      <button
        type="submit"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {{ editingPersonId ? 'Update' : 'Add' }} Person
      </button>
    </form>

    <!-- Persons List -->
    <div class="space-y-4">
      <div v-for="person in persons" :key="person.id" class="flex items-center justify-between p-4 border rounded">
        <div>
          <span class="font-bold">{{ person.name }}</span>
        </div>
        <div>
          <button
            @click="editPerson(person)"
            class="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            @click="deletePerson(person.id)"
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

import type { Person } from '@/types/Person.ts'
import apiClient from '@/api/axiosConfig.ts'

export default {
  data() {
    return {
      persons: [] as Person[],
      personForm: {} as Person,
      editingPersonId: null as number | null
    }
  },

  methods: {
    async fetchPersons() {
      try {
        const response = await apiClient.get('/persons')
        this.persons = await response.data
      } catch (error) {
        console.error('Error fetching persons:', error)
      }
    },

    async handleSubmit() {
      try {
        const url = this.editingPersonId
          ? `http://localhost:8080/api/persons/${this.editingPersonId}`
          : 'http://localhost:8080/api/persons'

        const method = this.editingPersonId ? 'PUT' : 'POST'

        const response = await apiClient.request({
          url: url,
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(this.personForm)
        })

        if (response.status === 200) {
          await this.fetchPersons()
          this.resetForm()
        }
      } catch (error) {
        console.error('Error saving person:', error)
      }
    },

    async deletePerson(id: number) {
      if (!confirm('Are you sure you want to delete this person?')) return

      try {
        const response = await apiClient.delete(`/persons/${id}`)

        if (response.status === 200) {
          await this.fetchPersons()
        }
      } catch (error) {
        console.error('Error deleting person:', error)
      }
    },

    editPerson(person: Person) {
      this.personForm = { ...person }
      this.editingPersonId = person.id
    },

    resetForm() {
      this.personForm = {
        id: 0,
        name: '',
      }
      this.editingPersonId = null
    }
  },

  mounted() {
    this.fetchPersons()
  }
}
</script>
