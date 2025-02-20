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
        {{ personForm.id ? 'Update' : 'Add' }} Person
      </button>
    </form>

    <!-- Persons List -->
    <div class="space-y-4">
      <div
        v-for="person in store.persons"
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
    <loading-indicator :isLoading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import { usePersonsStore } from '@/stores/personsStore.ts'
import type { Person } from '@/types/Person.ts'

const personForm = ref<Person>({ id: 0, name: '' })
const isLoading = ref(false)
const store = usePersonsStore()

const handleSubmit = async () => {
  isLoading.value = true
  await store.savePerson(personForm.value)
  resetForm()
  isLoading.value = false
}

const deletePerson = async (personToDelete: Person) => {
  if (!confirm('Are you sure you want to delete this person?')) return
  isLoading.value = true
  await store.deletePerson(personToDelete)
  isLoading.value = false
}

const editPerson = (person: Person) => {
  personForm.value = { ...person }
}

const resetForm = () => {
  personForm.value = { id: undefined, name: '' }
}

onMounted(() => {
  store.fetchPersons()
})
</script>
