<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Waldheim rockt :3</h1>
    <div class="flex gap-4">
      <add-consumption />
      <total-cost />
    </div>
  </div>
</template>

<script setup lang="ts">
import TotalCost from '@/components/persons/TotalCost.vue'
import AddConsumption from '@/components/persons/AddConsumption.vue'
import { onMounted } from 'vue'
import { usePersonsStore } from '@/stores/personsStore.ts'
import { useDrinksStore } from '@/stores/drinksStore.ts'

const personsStore = usePersonsStore()
const drinksStore = useDrinksStore()

onMounted(() => {
  personsStore.fetchPersons()
  drinksStore.fetchDrinks()
})
</script>
