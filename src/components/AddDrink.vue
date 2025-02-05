<template>
  <div>
    <h2>Add Drink</h2>
    <input v-model="personId" placeholder="Person ID" />
    <input v-model="name" placeholder="Drink Name" />
    <input v-model="price" placeholder="Drink Price" type="number" />
    <button @click="addDrink">Add</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      personId: '',
      name: '',
      price: 0,
    }
  },
  methods: {
    async addDrink() {
      try {
        const response = await axios.post(`/api/persons/${this.personId}/drinks`, {
          name: this.name,
          price: this.price,
        })
        alert('Drink added successfully!')
        this.personId = ''
        this.name = ''
        this.price = 0
      } catch (error) {
        console.error(error)
        alert('Error adding drink.')
      }
    },
  },
}
</script>
