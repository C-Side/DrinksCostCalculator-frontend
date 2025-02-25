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
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">
        {{ drinkForm.id ? 'Update' : 'Add' }} Drink
      </button>
    </form>

    <div class="space-y-4">
      <div
        v-for="drink in store.drinks"
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
import { ref } from 'vue'
import type { Drink } from '@/types/Drink.ts'
import { useDrinksStore } from '@/stores/drinksStore.ts'
import LoadingIndicator from '@/components/common/LoadingIndicator.vue'

const drinkForm = ref<Drink>({
  id: undefined,
  name: '',
  price: 0,
  drinkKind: { kind: '', isAlcoholic: false },
})
const isLoading = ref<boolean>(false)
const store = useDrinksStore()

const handleSubmit = async () => {
  isLoading.value = true
  await store.saveDrink(drinkForm.value)
  resetForm()
  isLoading.value = false
}

const deleteDrink = async (drinkToDelete: Drink) => {
  if (!confirm('Are you sure you want to delete this drink?')) return
  isLoading.value = true
  await store.deleteDrink(drinkToDelete)
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
    drinkKind: { kind: '', isAlcoholic: false },
  }
}
</script>
