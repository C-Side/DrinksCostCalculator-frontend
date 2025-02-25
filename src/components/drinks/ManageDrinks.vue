<template>
  <div class="p-8">
    <form class="mb-8 p-4 border rounded" @submit.prevent="handleSubmit">
      <input v-model="drinkForm.name" class="border p-2 mr-2" placeholder="Drink name" required />
      <input
        v-model.number="drinkForm.price"
        class="border p-2 mr-2"
        min="0.01"
        placeholder="Price"
        required
        step="0.01"
        type="number"
      />
      <label for="drinkCategory">Select category:</label>
      <select id="drinkCategory" v-model="selectedCategory" class="border p-2 mr-2">
        <option
          v-for="drinkCategory in drinkCategoriesStore.drinkCategories"
          :key="drinkCategory.id"
          :value="drinkCategory"
        >
          {{ drinkCategory.category }}
        </option>
      </select>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">
        {{ drinkForm.id ? 'Update' : 'Add' }} Drink
      </button>
    </form>

    <div class="space-y-4">
      <div
        v-for="drink in drinksStore.drinks"
        :key="drink.id"
        class="flex items-center justify-between p-4 border rounded"
      >
        <div>
          <span class="font-bold">{{ drink.name }}</span>
          <span class="ml-4">{{ formatCurrency(drink.price) }}</span>
        </div>
        <div>
          <button
            class="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
            @click="editDrink(drink)"
          >
            Edit
          </button>
          <button
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            @click="deleteDrink(drink)"
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
import { formatCurrency } from '@/util/format.ts'
import { onMounted, ref } from 'vue'
import LoadingIndicator from '@/components/common/LoadingIndicator.vue'
import type { Drink, DrinkCategory } from '@/types/Drink.ts'
import { useDrinksStore } from '@/stores/drinksStore.ts'
import { useDrinkCategoriesStore } from '@/stores/drinkCategoriesStore.ts'

const drinkForm = ref<Drink>({
  id: undefined,
  name: '',
  price: 0,
  drinkCategory: { id: 0, category: '', alcoholic: false },
})
const isLoading = ref<boolean>(false)
const drinksStore = useDrinksStore()
const drinkCategoriesStore = useDrinkCategoriesStore()
const selectedCategory = ref<DrinkCategory>(drinkCategoriesStore.drinkCategories[0])

const handleSubmit = async () => {
  isLoading.value = true
  drinkForm.value.drinkCategory = selectedCategory.value
  if (drinkForm.value.id) {
    await drinksStore.updateDrink(drinkForm.value)
  } else {
    await drinksStore.addDrink(drinkForm.value)
  }
  resetForm()
  isLoading.value = false
}

const deleteDrink = async (drinkToDelete: Drink) => {
  if (!confirm('Are you sure you want to delete this drink?')) return
  isLoading.value = true
  await drinksStore.deleteDrink(drinkToDelete)
  isLoading.value = false
}

const editDrink = (drink: Drink) => {
  drinkForm.value = { ...drink }
}

const resetForm = () => {
  drinkForm.value = {
    id: undefined,
    name: '',
    price: 0,
    drinkCategory: { category: '', alcoholic: false },
  }
}

onMounted(() => {
  selectedCategory.value = drinkCategoriesStore.drinkCategories[0]
})
</script>
