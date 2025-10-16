<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Navbar Component -->
    <Navbar app-name="DocuChain Verify">
      <template #nav-links>
        <button
          @click="$router.push('/verify-upload')"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          Verifikasi dengan Upload
        </button>
      </template>
    </Navbar>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Scan QR Code</h1>
        <p class="text-gray-600">Arahkan QR code pada dokumen ke kamera</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Camera Section -->
        <div v-if="!verificationResult && !scanError" class="space-y-6">
          <!-- Camera View -->
          <div class="relative bg-gray-900 rounded-xl overflow-hidden" style="aspect-ratio: 4/3;">
            <video
              v-if="isCameraActive"
              ref="videoElement"
              autoplay
              playsinline
              class="w-full h-full object-cover"
            ></video>
            
            <!-- Scanning Overlay -->
            <div v-if="isCameraActive" class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-64 h-64 border-4 border-white rounded-2xl relative">
                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl"></div>
                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"></div>
                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"></div>
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl"></div>
              </div>
            </div>

            <!-- Placeholder when camera not active -->
            <div v-if="!isCameraActive" class="absolute inset-0 flex flex-col items-center justify-center">
              <svg class="w-20 h-20 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p class="text-white text-lg mb-4">Kamera belum aktif</p>
              <button
                @click="startCamera"
                class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Aktifkan Kamera
              </button>
            </div>
          </div>

          <!-- Status Alert -->
          <Alert
            v-if="isScanning"
            variant="info"
            message="Scanning QR Code..."
            :closable="false"
          />

          <!-- Camera Controls -->
          <div class="flex gap-4">
            <button
              v-if="isCameraActive"
              @click="stopCamera"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Hentikan Kamera
            </button>
            <button
              v-else
              @click="startCamera"
              class="flex-1 px-4 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Mulai Scan
            </button>
          </div>

          <!-- Info Alert -->
          <Alert
            variant="info"
            :closable="false"
          >
            <div>
              <h3 class="text-sm font-medium text-blue-900 mb-2">Tips Scan QR Code</h3>
              <ul class="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Pastikan pencahayaan cukup</li>
                <li>Posisikan QR code di dalam frame</li>
                <li>Jaga jarak 10-20 cm dari kamera</li>
              </ul>
            </div>
          </Alert>
        </div>

        <!-- Scan Error -->
        <div v-if="scanError" class="space-y-6">
          <Alert
            variant="error"
            title="Gagal Mengakses Kamera"
            :message="scanError"
          />
          <button
            @click="resetScanner"
            class="w-full px-4 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Verification Result -->
        <div v-if="verificationResult" class="space-y-6">
          <!-- Valid Result -->
          <div v-if="verificationResult.isValid" class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Dokumen Valid ✅</h3>
            <p class="text-gray-600">QR code terdaftar dan dokumen terverifikasi</p>
          </div>

          <!-- Invalid Result -->
          <div v-else class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">QR Tidak Valid ❌</h3>
            <p class="text-gray-600">QR code tidak terdaftar atau dokumen palsu</p>
          </div>

          <!-- Document Details -->
          <div class="bg-gray-50 rounded-xl p-6 space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Hash Dokumen</label>
              <div class="mt-1 bg-white p-3 rounded-lg border border-gray-200">
                <p class="text-sm font-mono text-gray-900 break-all">{{ verificationResult.hash }}</p>
              </div>
            </div>
            <div v-if="verificationResult.isValid">
              <label class="text-sm font-medium text-gray-700">Nama Dokumen</label>
              <p class="mt-1 text-gray-900">{{ verificationResult.documentName }}</p>
            </div>
            <div v-if="verificationResult.isValid" class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Kategori</label>
                <p class="mt-1">
                  <Badge :label="verificationResult.category" variant="primary" />
                </p>
              </div>
              <div>
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
            <div v-if="verificationResult.isValid">
              <label class="text-sm font-medium text-gray-700">Tanggal Upload</label>
              <p class="mt-1 text-gray-900">{{ formatDate(verificationResult.uploadDate) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              @click="resetScanner"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Scan QR Lain
            </button>
            <button
              @click="$router.push('/verify-upload')"
              class="flex-1 px-4 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Verifikasi via Upload
            </button>
          </div>
        </div>
      </div>

      <!-- Alternative Method -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600">
          Tidak punya QR code? 
          <button @click="$router.push('/verify-upload')" class="text-indigo-600 hover:text-indigo-800 font-medium">
            Verifikasi dengan Upload File →
          </button>
        </p>
      </div>
    </div>

    <!-- Loading Overlay -->
    <Loading
      v-if="isScanning && !verificationResult"
      type="spinner"
      :full-screen="true"
      :overlay="true"
      text="Memverifikasi QR Code..."
    />
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import jsQR from 'jsqr'
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
import Badge from '@/components/Badge.vue'
import Loading from '@/components/Loading.vue'

const router = useRouter()
const videoElement = ref(null)
const isCameraActive = ref(false)
const isScanning = ref(false)
const scanError = ref(null)
const verificationResult = ref(null)

let stream = null
let animationFrameId = null

const startCamera = async () => {
  try {
    scanError.value = null
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      isCameraActive.value = true
      isScanning.value = true
      scanQRCode()
    }
  } catch (error) {
    console.error('Camera error:', error)
    scanError.value = 'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.'
    isCameraActive.value = false
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  isCameraActive.value = false
  isScanning.value = false
}

const scanQRCode = () => {
  if (!videoElement.value || !isCameraActive.value) return

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const scan = () => {
    if (videoElement.value && videoElement.value.readyState === videoElement.value.HAVE_ENOUGH_DATA) {
      canvas.height = videoElement.value.videoHeight
      canvas.width = videoElement.value.videoWidth
      context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        handleQRCodeDetected(code.data)
        return
      }
    }

    animationFrameId = requestAnimationFrame(scan)
  }

  scan()
}

const handleQRCodeDetected = async (qrData) => {
  stopCamera()
  isScanning.value = true

  try {
    const response = await fetch('/api/verify-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ qrData })
    })

    const data = await response.json()

    verificationResult.value = {
      hash: qrData,
      isValid: data.isValid,
      documentName: data.documentName || '',
      category: data.category || '',
      uploadDate: data.uploadDate || '',
      status: data.status || ''
    }
  } catch (error) {
    console.error('Verification error:', error)
    scanError.value = 'Terjadi kesalahan saat verifikasi'
  } finally {
    isScanning.value = false
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

const resetScanner = () => {
  verificationResult.value = null
  scanError.value = null
  isScanning.value = false
}

onUnmounted(() => {
  stopCamera()
})
</script>