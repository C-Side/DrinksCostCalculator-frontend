<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Persons Management</h1>
      <router-link to="/" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        Back to Home
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="mb-8 p-4 border rounded">
      <input v-model="personForm.name" placeholder="name" class="border p-2 mr-2" required />
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        {{ editingPersonId ? 'Update' : 'Add' }} Person
      </button>
    </form>

    <!-- Persons List -->
    <div class="space-y-4">
      <div
        v-for="person in persons"
        :key="person.id"
        class="flex items-center justify-between p-4 border rounded"
      >
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
            @click="deletePerson(person)"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <LoadingIndicator :isLoading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Person } from '@/types/Person.ts'
import apiClient from '@/api/axiosConfig.ts'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const persons = ref<Person[]>([])
const personForm = ref<Person>({ id: 0, name: '' })
const editingPersonId = ref<number | null>(null)
const isLoading = ref(false)

const fetchPersons = async () => {
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

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const method = editingPersonId.value ? 'PUT' : 'POST'

    const response = await apiClient.request({
      url: '/persons',
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(personForm.value)
    })

    if (response.status === 200) {
      await fetchPersons()
      resetForm()
    }
  } catch (error) {
    console.error('Error saving person:', error)
    isLoading.value = false
  }
}

const deletePerson = async (personToDelete: Person) => {
  isLoading.value = true
  if (!confirm('Are you sure you want to delete this person?')) return

  try {
    const response = await apiClient.delete(`/persons`, {
      data: personToDelete
    })
    if (response.status === 204) {
      await fetchPersons()
    }
  } catch (error) {
    console.error('Error deleting person:', error)
    isLoading.value = false
  }
}

const editPerson = (person: Person) => {
  personForm.value = { ...person }
  editingPersonId.value = person.id
}

const resetForm = () => {
  personForm.value = { id: 0, name: '' }
  editingPersonId.value = null
}

onMounted(() => {
  fetchPersons()
})
</script>
