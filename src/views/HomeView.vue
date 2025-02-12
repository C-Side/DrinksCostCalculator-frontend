<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Welcome to Drink Management System</h1>
    <div class="flex gap-4">
      <router-link
        to="/drinks"
        class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Manage Drinks
      </router-link>
      <router-link
        to="/persons"
        class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Manage Persons
      </router-link>
    </div>
  </div>
</template>
