<template>
  <div>
    <h2>Total Cost</h2>
    <input v-model="personId" placeholder="Person ID" />
    <button @click="getTotalCost">Get Total</button>
    <p v-if="totalCost !== null">Total Cost: {{ totalCost }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      personId: '',
      totalCost: null,
    }
  },
  methods: {
    async getTotalCost() {
      try {
        const response = await axios.get(`/api/persons/${this.personId}/total`)
        this.totalCost = response.data
      } catch (error) {
        console.error(error)
        alert('Error fetching total cost.')
      }
    },
  },
}
</script>
