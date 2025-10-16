<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
    <div class="flex items-center">
      <!-- Icon -->
      <div 
        :class="[
          'flex-shrink-0 rounded-lg p-3',
          iconBgColor
        ]"
      >
        <component :is="iconComponent" :class="['w-6 h-6', iconColor]" />
      </div>
      
      <!-- Stats Content -->
      <div class="ml-4 flex-1">
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>

      <!-- Trend Indicator (optional) -->
      <div v-if="trend" class="ml-2">
        <div 
          :class="[
            'flex items-center text-xs font-medium px-2 py-1 rounded-full',
            trendColor
          ]"
        >
          <svg 
            v-if="trend === 'up'" 
            class="w-3 h-3 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <svg 
            v-else-if="trend === 'down'" 
            class="w-3 h-3 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {{ trendValue }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'document',
    validator: (value) => ['document', 'check', 'cross', 'upload', 'users'].includes(value)
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'red', 'yellow', 'purple'].includes(value)
  },
  trend: {
    type: String,
    default: null,
    validator: (value) => !value || ['up', 'down', 'neutral'].includes(value)
  },
  trendValue: {
    type: String,
    default: ''
  }
})

// Icon mapping
const iconComponent = computed(() => {
  const icons = {
    document: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ]),
    check: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    cross: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    upload: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' })
    ]),
    users: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
    ])
  }
  return icons[props.icon]
})

// Color mapping
const colorMap = {
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
  green: { bg: 'bg-green-100', icon: 'text-green-600' },
  red: { bg: 'bg-red-100', icon: 'text-red-600' },
  yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600' },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600' }
}

const iconBgColor = computed(() => colorMap[props.color].bg)
const iconColor = computed(() => colorMap[props.color].icon)

const trendColor = computed(() => {
  if (!props.trend) return ''
  return {
    up: 'bg-green-100 text-green-700',
    down: 'bg-red-100 text-red-700',
    neutral: 'bg-gray-100 text-gray-700'
  }[props.trend]
})
</script>