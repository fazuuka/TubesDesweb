<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeOnBackdrop && close()"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>

        <!-- Modal Container -->
        <div class="flex items-center justify-center min-h-screen px-4 py-6">
          <div
            :class="[
              'relative bg-white rounded-2xl shadow-xl w-full transition-all',
              sizeClass
            ]"
            @click.stop
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
              <button
                v-if="showClose"
                @click="close"
                class="text-gray-400 hover:text-gray-600 transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-6 max-h-[60vh] overflow-y-auto">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="showFooter" class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <slot name="footer">
                <button
                  v-if="showCancelButton"
                  @click="close"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  {{ cancelText }}
                </button>
                <button
                  v-if="showConfirmButton"
                  @click="confirm"
                  :disabled="confirmDisabled"
                  :class="[
                    'px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white transition',
                    confirmDisabled ? 'opacity-50 cursor-not-allowed' : '',
                    confirmButtonClass
                  ]"
                >
                  {{ confirmText }}
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Modal'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  confirmText: {
    type: String,
    default: 'Konfirmasi'
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  confirmVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'success'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const sizeClass = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  }
  return sizes[props.size]
})

const confirmButtonClass = computed(() => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  }
  return variants[props.confirmVariant]
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const confirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>