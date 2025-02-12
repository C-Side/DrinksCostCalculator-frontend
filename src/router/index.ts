import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/HomeView.vue'
import Drinks from '../views/DrinksView.vue'
import Persons from '../views/PersonsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/drinks',
    name: 'drinks',
    component: Drinks
  },
  {
    path: '/persons',
    name: 'persons',
    component: Persons
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
