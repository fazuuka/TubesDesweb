<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Navbar Component -->
    <Navbar app-name="BlokBlok">
      <template #nav-links>
        <button
          @click="$router.push('/Landing')"
          class="text-sm text-cyan-600 hover:text-cyan-900 mr-10"
        >
      Home
        </button>
        <button
          @click="$router.push('/login')"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Login
        </button>
      </template>
    </Navbar>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Verifikasi Dokumen</h1>
        <p class="text-gray-600">Upload dokumen untuk memverifikasi keasliannya</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Upload Section -->
        <div v-if="!verificationResult" class="space-y-6">
          <!-- File Upload Component -->
          <FileUpload
            placeholder="Drag & drop dokumen di sini atau klik untuk memilih"
            hint="Mendukung PDF dan DOCX, maksimal 10MB"
            accept=".pdf,.docx"
            :max-size="10485760"
            v-model="selectedFile"
            @file-selected="handleFileSelected"
            @file-removed="handleFileRemoved"
            @error="handleError"
          />

          <!-- Verify Button -->
          <button
            v-if="selectedFile"
            @click="verifyDocument"
            :disabled="isVerifying"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <svg v-if="isVerifying" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isVerifying ? 'Memverifikasi...' : 'Verifikasi Dokumen' }}
          </button>

          <!-- Info Alert -->
          <Alert
            variant="info"
            message="Sistem akan menghitung hash dari dokumen yang Anda upload dan memverifikasinya dengan data yang tersimpan di blockchain. Dokumen asli akan memiliki hash yang sama dengan yang terdaftar."
            :closable="false"
          />
        </div>

        <!-- Verification Result -->
        <div v-else class="space-y-6">
          <!-- Valid Result -->
          <div v-if="verificationResult.isValid" class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Dokumen Valid ✅</h3>
            <p class="text-gray-600">Dokumen ini terdaftar dan terverifikasi di blockchain</p>
          </div>

          <!-- Invalid Result -->
          <div v-else class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Dokumen Tidak Valid ❌</h3>
            <p class="text-gray-600">Dokumen ini tidak terdaftar atau telah dimodifikasi</p>
          </div>

          <!-- Document Details -->
          <div class="bg-gray-50 rounded-xl p-6 space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Nama File</label>
              <p class="mt-1 text-gray-900">{{ verificationResult.fileName }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Hash Dokumen</label>
              <div class="mt-1 bg-white p-3 rounded-lg border border-gray-200">
                <p class="text-sm font-mono text-gray-900 break-all">{{ verificationResult.hash }}</p>
              </div>
            </div>
            <div v-if="verificationResult.isValid" class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Kategori</label>
                <p class="mt-1">
                  <Badge :label="verificationResult.category" variant="primary" />
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Tanggal Upload</label>
                <p class="mt-1 text-gray-900">{{ formatDate(verificationResult.uploadDate) }}</p>
              </div>
            </div>
            <div v-if="verificationResult.isValid">
              <label class="text-sm font-medium text-gray-700">Status</label>
              <p class="mt-1">
                <Badge
                  :label="verificationResult.status === 'active' ? 'Aktif' : 'Dicabut'"
                  :variant="verificationResult.status === 'active' ? 'success' : 'danger'"
                  show-dot
                />
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              @click="resetVerification"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Verifikasi Dokumen Lain
            </button>
            <button
              @click="$router.push('/verify-qr')"
              class="flex-1 px-4 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Verifikasi dengan QR
            </button>
          </div>
        </div>
      </div>

      <!-- Alternative Method -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600">
          Punya QR code? 
          <button @click="$router.push('/verify-qr')" class="text-indigo-600 hover:text-indigo-800 font-medium">
            Verifikasi dengan QR Code →
          </button>
        </p>
      </div>
    </div>

    <!-- Loading Overlay -->
    <Loading
      v-if="isVerifying"
      type="spinner"
      :full-screen="true"
      :overlay="true"
      text="Memverifikasi dokumen..."
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import FileUpload from '@/components/FileUpload.vue'
import Alert from '@/components/Alert.vue'
import Badge from '@/components/Badge.vue'
import Loading from '@/components/Loading.vue'

const router = useRouter()

const selectedFile = ref(null)
const isVerifying = ref(false)
const verificationResult = ref(null)

const handleFileSelected = (file) => {
  console.log('File selected:', file)
}

const handleFileRemoved = () => {
  console.log('File removed')
  verificationResult.value = null
}

const handleError = (error) => {
  console.error('File error:', error)
}

const calculateHash = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const verifyDocument = async () => {
  if (!selectedFile.value) return

  isVerifying.value = true

  try {
    const hash = await calculateHash(selectedFile.value)

    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hash })
    })

    const data = await response.json()

    verificationResult.value = {
      fileName: selectedFile.value.name,
      hash: hash,
      isValid: data.isValid,
      category: data.category || '',
      uploadDate: data.uploadDate || '',
      status: data.status || ''
    }
  } catch (error) {
    console.error('Verification error:', error)
    alert('Terjadi kesalahan saat verifikasi')
  } finally {
    isVerifying.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const resetVerification = () => {
  verificationResult.value = null
  selectedFile.value = null
}
</script>