<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-xl p-8 text-center transition',
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      @click="!disabled && !selectedFile && triggerFileInput()"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        @change="handleFileSelect"
        class="hidden"
        :disabled="disabled"
      />
      
      <!-- No file selected state -->
      <div v-if="!selectedFile">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="mt-2 text-sm text-gray-600">{{ placeholder }}</p>
        <button
          type="button"
          @click.stop="triggerFileInput"
          :disabled="disabled"
          class="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pilih File
        </button>
        <p class="mt-2 text-xs text-gray-500">{{ hint }}</p>
      </div>

      <!-- File selected state -->
      <div v-else class="flex items-center justify-center">
        <div class="flex items-center bg-gray-50 rounded-lg p-4 pr-20 relative">
          <svg class="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div class="ml-4 text-left">
            <p class="text-base font-medium text-gray-900">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
            <p v-if="showPreview && fileType === 'image'" class="text-xs text-gray-400 mt-1">
              {{ selectedFile.type }}
            </p>
          </div>
          <button
            v-if="!disabled"
            @click.stop="removeFile"
            class="absolute right-4 text-red-600 hover:text-red-800 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Image Preview (optional) -->
      <div v-if="showPreview && fileType === 'image' && previewUrl" class="mt-4">
        <img :src="previewUrl" alt="Preview" class="mx-auto max-h-48 rounded-lg border border-gray-200" />
      </div>
    </div>

    <!-- Error message -->
    <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>

    <!-- Progress bar -->
    <div v-if="showProgress && progress > 0" class="mt-4">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-600">{{ progressLabel }}</span>
        <span class="text-indigo-600 font-medium">{{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          :style="{ width: progress + '%' }"
          class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Drag & drop file atau klik untuk memilih'
  },
  hint: {
    type: String,
    default: 'PDF atau DOCX, maksimal 10MB'
  },
  accept: {
    type: String,
    default: '.pdf,.docx'
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showPreview: {
    type: Boolean,
    default: false
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  progressLabel: {
    type: String,
    default: 'Uploading...'
  },
  modelValue: {
    type: File,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'file-selected', 'file-removed', 'error'])

const fileInput = ref(null)
const selectedFile = ref(props.modelValue)
const isDragging = ref(false)
const errorMessage = ref('')
const previewUrl = ref('')

const fileType = computed(() => {
  if (!selectedFile.value) return null
  const type = selectedFile.value.type
  if (type.startsWith('image/')) return 'image'
  if (type === 'application/pdf') return 'pdf'
  return 'other'
})

watch(() => props.modelValue, (newValue) => {
  selectedFile.value = newValue
})

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const validateFile = (file) => {
  errorMessage.value = ''

  // Check file type
  const allowedTypes = props.accept.split(',').map(t => t.trim())
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
  const mimeType = file.type

  const isValidType = allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return fileExtension === type
    }
    return mimeType.includes(type)
  })

  if (!isValidType) {
    errorMessage.value = `Format file tidak didukung. Hanya: ${props.accept}`
    emit('error', errorMessage.value)
    return false
  }

  // Check file size
  if (file.size > props.maxSize) {
    const maxSizeMB = (props.maxSize / (1024 * 1024)).toFixed(0)
    errorMessage.value = `Ukuran file maksimal ${maxSizeMB}MB`
    emit('error', errorMessage.value)
    return false
  }

  return true
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && validateFile(file)) {
    setFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && validateFile(file)) {
    setFile(file)
  }
}

const setFile = (file) => {
  selectedFile.value = file
  emit('update:modelValue', file)
  emit('file-selected', file)
  
  // Generate preview for images
  if (props.showPreview && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  previewUrl.value = ''
  errorMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', null)
  emit('file-removed')
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>