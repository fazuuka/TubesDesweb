<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar Component -->
    <Navbar
      :show-back-button="true"
      back-to="/dashboard"
    />

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Upload Dokumen Akademik</h1>
        <p class="text-gray-600 mb-8">Upload dokumen untuk disimpan dan diverifikasi dengan blockchain</p>

        <!-- Alert Component -->
        <Alert
          v-if="alertMessage"
          v-model:show="showAlert"
          :variant="alertVariant"
          :title="alertTitle"
          :message="alertMessage"
          :auto-close="true"
          :duration="5000"
          class="mb-6"
        />

        <!-- Upload Form -->
        <div v-if="!uploadSuccess" class="space-y-6">
          <!-- Category Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kategori Dokumen <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.category"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="">Pilih Kategori</option>
              <option value="Ijazah">Ijazah</option>
              <option value="Transkrip Nilai">Transkrip Nilai</option>
              <option value="Sertifikat">Sertifikat</option>
              <option value="Surat Keterangan">Surat Keterangan</option>
            </select>
          </div>

          <!-- File Upload Component -->
          <FileUpload
            label="File Dokumen"
            placeholder="Drag & drop file atau klik untuk memilih"
            hint="PDF atau DOCX, maksimal 10MB"
            accept=".pdf,.docx"
            :max-size="10485760"
            :required="true"
            :show-progress="isUploading"
            :progress="uploadProgress"
            progress-label="Mengupload dokumen..."
            v-model="selectedFile"
            @file-selected="handleFileSelected"
            @file-removed="handleFileRemoved"
            @error="handleFileError"
          />

          <!-- Submit Button -->
          <button
            @click="handleUpload"
            :disabled="!selectedFile || !formData.category || isUploading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {{ isUploading ? 'Mengupload...' : 'Upload Dokumen' }}
          </button>
        </div>

        <!-- Success State -->
        <div v-else class="space-y-6">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Upload Berhasil!</h3>
            <p class="text-gray-600">Dokumen telah tersimpan di blockchain</p>
          </div>

          <!-- Document Info -->
          <div class="bg-gray-50 rounded-xl p-6 space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Nama File</label>
              <p class="mt-1 text-gray-900">{{ uploadResult.fileName }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Hash Dokumen</label>
              <div class="mt-1 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                <p class="text-sm font-mono text-gray-900 truncate mr-2">{{ uploadResult.hash }}</p>
                <button
                  @click="copyHash"
                  class="flex-shrink-0 text-indigo-600 hover:text-indigo-800"
                  title="Copy Hash"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- QR Code -->
          <div class="text-center">
            <label class="block text-sm font-medium text-gray-700 mb-4">QR Code Verifikasi</label>
            <div class="inline-block bg-white p-6 rounded-xl border-2 border-gray-200">
              <div ref="qrcodeContainer" class="mx-auto"></div>
            </div>
            <button
              @click="downloadQR"
              class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR Code
            </button>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              @click="resetForm"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Upload Dokumen Lain
            </button>
            <button
              @click="$router.push('/dashboard')"
              class="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <Loading
      v-if="isUploading"
      type="spinner"
      :full-screen="true"
      :overlay="true"
      text="Mengupload dokumen..."
    />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'
import Navbar from '@/components/Navbar.vue'
import FileUpload from '@/components/FileUpload.vue'
import Alert from '@/components/Alert.vue'
import Loading from '@/components/Loading.vue'

const qrcodeContainer = ref(null)
const selectedFile = ref(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadSuccess = ref(false)

const formData = ref({
  category: ''
})

const uploadResult = ref({
  fileName: '',
  hash: '',
  qrData: ''
})

const showAlert = ref(false)
const alertVariant = ref('success')
const alertTitle = ref('')
const alertMessage = ref('')

const handleFileSelected = (file) => {
  console.log('File selected:', file)
}

const handleFileRemoved = () => {
  console.log('File removed')
}

const handleFileError = (error) => {
  showAlertMessage('error', 'Error', error)
}

const handleUpload = async () => {
  if (!selectedFile.value || !formData.value.category) return

  isUploading.value = true
  uploadProgress.value = 0

  const formDataToSend = new FormData()
  formDataToSend.append('file', selectedFile.value)
  formDataToSend.append('category', formData.value.category)

  try {
    const token = localStorage.getItem('auth_token')
    
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    const data = await response.json()

    if (response.ok) {
      uploadResult.value = {
        fileName: selectedFile.value.name,
        hash: data.hash,
        qrData: data.qrData || data.hash
      }
      
      uploadSuccess.value = true
      
      await nextTick()
      await generateQRCode()
    } else {
      showAlertMessage('error', 'Upload Gagal', data.message || 'Terjadi kesalahan')
    }
  } catch (error) {
    console.error('Upload error:', error)
    showAlertMessage('error', 'Error', 'Terjadi kesalahan saat mengupload')
  } finally {
    isUploading.value = false
  }
}

const generateQRCode = async () => {
  if (!qrcodeContainer.value) return
  
  try {
    await QRCode.toCanvas(
      qrcodeContainer.value,
      uploadResult.value.qrData,
      {
        width: 200,
        margin: 2,
        color: {
          dark: '#4F46E5',
          light: '#FFFFFF'
        }
      }
    )
  } catch (error) {
    console.error('QR generation error:', error)
  }
}

const copyHash = () => {
  navigator.clipboard.writeText(uploadResult.value.hash)
  showAlertMessage('success', 'Berhasil', 'Hash berhasil disalin!')
}

const downloadQR = () => {
  const canvas = qrcodeContainer.value.querySelector('canvas')
  if (canvas) {
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `qr-${uploadResult.value.hash.substring(0, 8)}.png`
    link.href = url
    link.click()
  }
}

const resetForm = () => {
  selectedFile.value = null
  formData.value.category = ''
  uploadSuccess.value = false
  uploadProgress.value = 0
}

const showAlertMessage = (variant, title, message) => {
  alertVariant.value = variant
  alertTitle.value = title
  alertMessage.value = message
  showAlert.value = true
}
</script>