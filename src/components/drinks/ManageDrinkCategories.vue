<template>
  <div class="p-6 bg-white shadow rounded-lg">
    <h2 class="text-xl font-bold mb-4">Manage Drink Categories</h2>

    <form @submit.prevent="handleSubmit">
      <input
        v-model="drinkCategoryForm.category"
        class="border p-2 rounded w-full mb-2"
        placeholder="Category"
      />
      <label class="flex items-center space-x-2">
        <input v-model="drinkCategoryForm.alcoholic" type="checkbox" />
        <span>Is Alcoholic</span>
      </label>
      <button class="bg-blue-500 text-white px-4 py-2 rounded mt-2" type="submit">Add</button>
    </form>

    <ul class="mt-4">
      <li
        v-for="drinkCategory in store.drinkCategories"
        :key="drinkCategory.id"
        class="flex justify-between items-center p-2 border rounded mt-2"
      >
        <span
          >{{ drinkCategory.category }} -
          {{ drinkCategory.alcoholic ? 'Alcoholic' : 'Non-Alcoholic' }}</span
        >
        <button
          class="bg-red-500 text-white px-2 py-1 rounded"
          @click="deleteDrinkCategory(drinkCategory)"
        >
          Delete
        </button>
      </li>
    </ul>
    <LoadingIndicator :isLoading="isLoading" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDrinkCategoriesStore } from '@/stores/drinkCategoriesStore'
import type { DrinkCategory } from '@/types/Drink.ts'
import LoadingIndicator from '@/components/common/LoadingIndicator.vue'

const drinkCategoryForm = ref<DrinkCategory>({ id: undefined, category: '', alcoholic: false })
const isLoading = ref<boolean>(false)
const store = useDrinkCategoriesStore()

const handleSubmit = async () => {
  isLoading.value = true
  if (drinkCategoryForm.value.id) {
    await store.updateDrinkCategory(drinkCategoryForm.value)
  } else {
    await store.addDrinkCategory(drinkCategoryForm.value)
  }
  resetForm()
  isLoading.value = false
}

const deleteDrinkCategory = async (drinkCategory: DrinkCategory) => {
  if (!confirm('Are you sure you want to delete this category of drink?')) return
  await store.deleteDrinkCategory(drinkCategory)
}

const resetForm = () => {
  drinkCategoryForm.value = {
    id: undefined,
    category: '',
    alcoholic: false,
  }
}
</script>
