<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <RouterLink
              to="/"
              class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/drinks"
              class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Drinks
            </RouterLink>
            <RouterLink
              to="/persons"
              class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Persons
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>
