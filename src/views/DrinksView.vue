<template>
  <manage-drinks />
  <manage-drink-categories />
</template>

<script setup lang="ts">
import ManageDrinks from '@/components/drinks/ManageDrinks.vue'
import ManageDrinkCategories from '@/components/drinks/ManageDrinkCategories.vue'
import { onMounted } from 'vue'
import { useDrinksStore } from '@/stores/drinksStore.ts'
import { useDrinkCategoriesStore } from '@/stores/drinkCategoriesStore.ts'

const drinksStore = useDrinksStore()
const drinkCategoriesStore = useDrinkCategoriesStore()

onMounted(() => {
  drinksStore.fetchDrinks()
  drinkCategoriesStore.fetchDrinkCategories()
})
</script>
