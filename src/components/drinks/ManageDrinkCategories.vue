<template>
  <div class="p-8">
    <h2 class="text-xl font-bold mb-4">Manage Drink Categories</h2>

    <form class="mb-8 p-4 border rounded" @submit.prevent="handleSubmit">
      <input
        v-model="drinkCategoryForm.category"
        class="border p-2 mr-2"
        placeholder="Category"
        required
      />
      <input
        id="isAlcoholic"
        v-model="drinkCategoryForm.alcoholic"
        class="border p-2 mr-2"
        type="checkbox"
      />
      <label for="isAlcoholic"> Is Alcoholic </label>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">
        {{ drinkCategoryForm.id ? 'Update' : 'Add' }} drink category
      </button>
    </form>

    <div class="space-y-4">
      <div
        v-for="drinkCategory in drinkCategoriesStore.drinkCategories"
        :key="drinkCategory.id"
        class="flex items-center justify-between p-4 border rounded"
      >
        <div>
          <span class="font-bold">{{ drinkCategory.category }}</span>
          <span class="ml-4">{{ drinkCategory.alcoholic }}</span>
        </div>
        <div>
          <button
            class="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
            @click="editDrinkCategory(drinkCategory)"
          >
            Edit
          </button>
          <button
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            @click="deleteDrinkCategory(drinkCategory)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <LoadingIndicator :isLoading="isLoading" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDrinkCategoriesStore } from '@/stores/drinkCategoriesStore'
import type { DrinkCategory } from '@/types/Drink.ts'
import LoadingIndicator from '@/components/common/LoadingIndicator.vue'

const drinkCategoryForm = ref<DrinkCategory>({
  category: '',
  alcoholic: false,
})
const isLoading = ref<boolean>(false)
const drinkCategoriesStore = useDrinkCategoriesStore()

const handleSubmit = async () => {
  isLoading.value = true
  if (drinkCategoryForm.value.id) {
    await drinkCategoriesStore.updateDrinkCategory(drinkCategoryForm.value)
  } else {
    await drinkCategoriesStore.addDrinkCategory(drinkCategoryForm.value)
  }
  resetForm()
  isLoading.value = false
}

const editDrinkCategory = (drinkCategory: DrinkCategory) => {
  drinkCategoryForm.value = { ...drinkCategory }
}

const deleteDrinkCategory = async (drinkCategory: DrinkCategory) => {
  if (!confirm('Are you sure you want to delete this category of drink?')) return
  await drinkCategoriesStore.deleteDrinkCategory(drinkCategory)
}

const resetForm = () => {
  drinkCategoryForm.value = {
    category: '',
    alcoholic: false,
  }
}
</script>
