import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import VerifyUploadPage from '../views/VerifyUploadPage.vue'
import VerifyQRPage from '../views/VerifyQRPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/upload',
    name: 'Upload',
    component: UploadPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/verify-upload',
    name: 'VerifyUpload',
    component: VerifyUploadPage,
    meta: { public: true }
  },
  {
    path: '/verify-qr',
    name: 'VerifyQR',
    component: VerifyQRPage,
    meta: { public: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token

  // Redirect authenticated users away from login page
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  }
  // Redirect unauthenticated users to login
  else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Allow navigation
  else {
    next()
  }
})

export default router