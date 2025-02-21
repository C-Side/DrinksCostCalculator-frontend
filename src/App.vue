<template>
  <div v-if="state.isAuthenticated">
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <RouterLink
                class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
                to="/"
              >
                Home
              </RouterLink>
              <RouterLink
                class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
                to="/drinks"
              >
                Drinks
              </RouterLink>
              <RouterLink
                class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
                to="/persons"
              >
                Persons
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
    <button @click="handleLogout">Log Out</button>
  </div>
  <div v-else>
    <button @click="handleLogin">Log In</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { msalService } from './config/useAuth'
import { msalInstance, state } from './config/msalConfig'

const { login, logout, handleRedirect, registerAuthorizationHeaderInterceptor } = msalService()

const handleLogin = async () => {
  await login()
}

const handleLogout = () => {
  logout()
}

const initialize = async () => {
  try {
    await msalInstance.initialize()
    registerAuthorizationHeaderInterceptor() // Call the initialize function
  } catch (error) {
    console.log('Initialization error', error)
  }
}
onMounted(async () => {
  await initialize()
  await handleRedirect()
})
</script>
