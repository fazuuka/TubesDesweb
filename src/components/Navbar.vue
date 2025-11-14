<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo & Brand -->
        <div class="flex items-center">
          <button 
            v-if="showBackButton" 
            @click="handleBack"
            class="mr-4 text-gray-600 hover:text-gray-900 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div class="flex-shrink-0 flex items-center cursor-pointer" @click="goToHome">
            <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span class="ml-3 text-xl font-semibold text-gray-900">{{ appName }}</span>
          </div>
        </div>
        
        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- User Info (if logged in) -->
          <div v-if="userName" class="hidden md:block">
            <span class="text-sm text-gray-600">{{ userRole }}: <span class="font-medium text-gray-900">{{ userName }}</span></span>
          </div>

          <!-- Navigation Links (optional) -->
          <slot name="nav-links"></slot>
          
          <!-- Logout Button (if logged in) -->
          <button
            v-if="showLogout"
            @click="handleLogout"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  appName: {
    type: String,
    default: 'BlokBlok'
  },
  userName: {
    type: String,
    default: ''
  },
  userRole: {
    type: String,
    default: 'Admin'
  },
  showLogout: {
    type: Boolean,
    default: false
  },
  showBackButton: {
    type: Boolean,
    default: false
  },
  backTo: {
    type: String,
    default: '/dashboard'
  }
})

const emit = defineEmits(['logout', 'back'])
const router = useRouter()

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    emit('logout')
  }
}

const handleBack = () => {
  if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
  emit('back')
}

const goToHome = () => {
  router.push('/dashboard')
}
</script>