<template>
  <div id="app">
    <h1>Drink Cost Calculator</h1>
    <CreatePerson />
    <AddDrink />
    <TotalCost />
  </div>
</template>

<script lang="ts">
import CreatePerson from './components/CreatePerson.vue'
import AddDrink from './components/AddDrink.vue'
import TotalCost from './components/TotalCost.vue'

export default {
  components: {
    CreatePerson,
    AddDrink,
    TotalCost,
  },
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  margin: 20px;
}
</style>
