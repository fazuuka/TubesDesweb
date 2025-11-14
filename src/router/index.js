import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import UploadPage from '../views/UploadPage.vue'
import VerifyUploadPage from '../views/VerifyUploadPage.vue'
import VerifyQRPage from '../views/VerifyQRPage.vue'
import LandingPage from '../views/LandingPage.vue'

const routes = [
  // Landing Page - Halaman Pertama
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { public: true }
  },
  
  // Public Pages - Verifikasi (Tidak perlu login)
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
  
  // Login Page
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  
  // Admin Pages (Perlu login)
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
  
  // Catch all - redirect ke landing
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
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

  // Jika sudah login dan coba akses login page, redirect ke dashboard
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } 
  // Jika belum login dan coba akses halaman admin, redirect ke login
  else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } 
  // Allow navigation
  else {
    next()
  }
})

export default router


// const routes = [
//   {
//     path: '/',
//     redirect: '/login'
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     component: LoginPage,
//     meta: { requiresGuest: true }
//   },
//   {
//     path: '/landing',
//     name: 'Landing',
//     component: LandingPage,
//     meta: {requiresGuest: false }
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: DashboardPage,
//     meta: { requiresAuth: false }
//   },
//   {
//     path: '/upload',
//     name: 'Upload',
//     component: UploadPage,
//     meta: { requiresAuth: false }
//   },
//   {
//     path: '/verify-upload',
//     name: 'VerifyUpload',
//     component: VerifyUploadPage,
//     meta: { public: false }
//   },
//   {
//     path: '/verify-qr',
//     name: 'VerifyQR',
//     component: VerifyQRPage,
//     meta: { public: false }
//   },
//   {
//     path: '/:pathMatch(.*)*',
//     redirect: '/login'
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// // Navigation Guards
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('auth_token')
//   const isAuthenticated = !!token

//   // Redirect authenticated users away from login page
//   if (to.meta.requiresGuest && isAuthenticated) {
//     next('/dashboard')
//   }
//   // Redirect unauthenticated users to login
//   else if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login')
//   }
//   // Allow navigation
//   else {
//     next()
//   }
// })

// export default router