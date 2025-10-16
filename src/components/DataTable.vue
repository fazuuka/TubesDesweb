<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
      <slot name="header-actions"></slot>
    </div>

    <!-- Search & Filter -->
    <div v-if="showSearch || showFilter" class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
      <!-- Search -->
      <div v-if="showSearch" class="flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            :value="searchValue"
            @input="$emit('update:searchValue', $event.target.value)"
            type="text"
            :placeholder="searchPlaceholder"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Filter -->
      <div v-if="showFilter">
        <select
          :value="filterValue"
          @change="$emit('update:filterValue', $event.target.value)"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
        >
          <option value="">{{ filterPlaceholder }}</option>
          <option v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
            <th v-if="showActions" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, index) in data" :key="index" class="hover:bg-gray-50 transition">
            <td v-for="column in columns" :key="column.key" class="px-6 py-4">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
            <td v-if="showActions" class="px-6 py-4">
              <slot name="actions" :row="row"></slot>
            </td>
          </tr>
          
          <!-- Empty State -->
          <tr v-if="data.length === 0">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="mt-2 text-sm text-gray-600">{{ emptyMessage }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination (optional) -->
    <div v-if="showPagination" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Menampilkan {{ startItem }} - {{ endItem }} dari {{ totalItems }} data
      </div>
      <div class="flex gap-2">
        <button
          @click="$emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="$emit('page-change', currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Data Table'
  },
  columns: {
    type: Array,
    required: true,
    // Format: [{ key: 'name', label: 'Nama' }]
  },
  data: {
    type: Array,
    required: true
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  searchValue: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Cari...'
  },
  showFilter: {
    type: Boolean,
    default: false
  },
  filterValue: {
    type: String,
    default: ''
  },
  filterPlaceholder: {
    type: String,
    default: 'Filter...'
  },
  filterOptions: {
    type: Array,
    default: () => []
    // Format: [{ value: 'active', label: 'Aktif' }]
  },
  showActions: {
    type: Boolean,
    default: true
  },
  emptyMessage: {
    type: String,
    default: 'Tidak ada data'
  },
  showPagination: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  totalItems: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:searchValue', 'update:filterValue', 'page-change'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))
</script>