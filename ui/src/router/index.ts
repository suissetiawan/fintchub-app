import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('@/views/TransactionsView.vue'),
        },
        {
          path: 'budget',
          name: 'budget',
          component: () => import('@/views/BudgetView.vue'),
        },
        {
          path: 'more',
          name: 'more',
          component: () => import('@/views/MoreView.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/CategoriesView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/auth/UsersView.vue'),
          meta: { isAdmin: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'login' })
  } else if (to.meta.guest && authStore.isLoggedIn) {
    next({ name: 'dashboard' })
  } else if (to.meta.isAdmin && !authStore.isAdmin) {
    next({ name: 'dashboard' }) // Or a customized 403 page
  } else {
    next()
  }
})

export default router
