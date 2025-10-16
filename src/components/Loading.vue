<template>
  <div v-if="visible" :class="containerClass">
    <!-- Spinner Type -->
    <div v-if="type === 'spinner'" class="flex flex-col items-center">
      <svg
        :class="[spinnerSizeClass, 'animate-spin']"
        :style="{ color: color }"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p v-if="text" :class="['mt-3', textSizeClass]" :style="{ color: textColor }">
        {{ text }}
      </p>
    </div>

    <!-- Dots Type -->
    <div v-else-if="type === 'dots'" class="flex space-x-2">
      <div
        v-for="i in 3"
        :key="i"
        :class="['rounded-full animate-bounce', dotSizeClass]"
        :style="{ backgroundColor: color, animationDelay: `${i * 0.15}s` }"
      ></div>
    </div>

    <!-- Pulse Type -->
    <div v-else-if="type === 'pulse'" class="flex justify-center items-center">
      <div
        :class="['rounded-full animate-pulse', pulseSizeClass]"
        :style="{ backgroundColor: color }"
      ></div>
    </div>

    <!-- Skeleton Type -->
    <div v-else-if="type === 'skeleton'" class="w-full space-y-3">
      <div v-for="i in skeletonLines" :key="i" class="animate-pulse">
        <div :class="['bg-gray-200 rounded', skeletonHeightClass]" :style="{ width: getSkeletonWidth(i) }"></div>
      </div>
    </div>

    <!-- Bars Type -->
    <div v-else-if="type === 'bars'" class="flex space-x-1">
      <div
        v-for="i in 5"
        :key="i"
        :class="['w-1 rounded-full animate-pulse', barHeightClass]"
        :style="{ backgroundColor: color, animationDelay: `${i * 0.1}s` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['spinner', 'dots', 'pulse', 'skeleton', 'bars'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: '#4F46E5' // indigo-600
  },
  text: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: '#6B7280' // gray-600
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  },
  skeletonLines: {
    type: Number,
    default: 3
  }
})

const containerClass = computed(() => {
  const classes = ['flex justify-center items-center']
  
  if (props.fullScreen) {
    classes.push('fixed inset-0 z-50')
  }
  
  if (props.overlay) {
    classes.push('bg-white bg-opacity-90')
  }
  
  return classes.join(' ')
})

const spinnerSizeClass = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }
  return sizes[props.size]
})

const textSizeClass = computed(() => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }
  return sizes[props.size]
})

const dotSizeClass = computed(() => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-6 h-6'
  }
  return sizes[props.size]
})

const pulseSizeClass = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }
  return sizes[props.size]
})

const skeletonHeightClass = computed(() => {
  const sizes = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6'
  }
  return sizes[props.size]
})

const barHeightClass = computed(() => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12'
  }
  return sizes[props.size]
})

const getSkeletonWidth = (index) => {
  const widths = ['100%', '85%', '90%', '95%', '80%']
  return widths[index % widths.length]
}
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}
</style>