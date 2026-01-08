import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'

import AppLayout from '../layouts/AppLayout.vue'

import PlantsView from '../views/home/PlantsView.vue'
import NeedsWaterView from '../views/home/NeedWaterView.vue'
import LocationsView from '../views/home/LocationsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: LandingView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },

    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'plants', component: PlantsView },
        { path: 'needs-water', component: NeedsWaterView },
        { path: 'locations', component: LocationsView },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/plants' },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
