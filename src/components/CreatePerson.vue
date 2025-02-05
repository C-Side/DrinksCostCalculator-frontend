<template>
  <div>
    <h2>Create Person</h2>
    <input v-model="name" placeholder="Enter person's name" />
    <button @click="createPerson">Create</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      name: '',
    }
  },
  methods: {
    async createPerson() {
      try {
        const response = await axios.post('/api/persons', { name: this.name, drinks: [] })
        alert(`Person created with ID: ${response.data.id}`)
        this.name = ''
      } catch (error) {
        console.error(error)
        alert('Error creating person.')
      }
    },
  },
}
</script>
