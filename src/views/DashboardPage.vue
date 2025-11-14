<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar Component -->
    <Navbar
      :user-name="userData.name"
      user-role="Admin"
      :show-logout="true"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Alert Component -->
      <Alert
        v-if="showAlert"
        v-model:show="showAlert"
        :variant="alertVariant"
        :title="alertTitle"
        :message="alertMessage"
        :auto-close="true"
        :duration="5000"
      />

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Dokumen"
          :value="stats.total"
          icon="document"
          color="blue"
        />
        <StatsCard
          title="Dokumen Aktif"
          :value="stats.active"
          icon="check"
          color="green"
        />
        <StatsCard
          title="Dokumen Dicabut"
          :value="stats.revoked"
          icon="cross"
          color="red"
        />
      </div>

      <!-- Data Table Component -->
      <DataTable
        title="Daftar Dokumen"
        :columns="columns"
        :data="filteredDocuments"
        v-model:search-value="searchQuery"
        v-model:filter-value="filterStatus"
        :show-filter="true"
        :filter-options="filterOptions"
        search-placeholder="Cari dokumen..."
        filter-placeholder="Semua Status"
        empty-message="Belum ada dokumen yang diupload"
      >
        <!-- Header Actions -->
        <template #header-actions>
          <button
            @click="$router.push('/upload')"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Upload Dokumen Baru
          </button>
        </template>

        <!-- Custom Cell: Nama Dokumen -->
        <template #cell-name="{ row }">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">{{ row.name }}</div>
              <div class="text-sm text-gray-500">{{ row.hash.substring(0, 20) }}...</div>
            </div>
          </div>
        </template>

        <!-- Custom Cell: Kategori -->
        <template #cell-category="{ value }">
          <Badge :label="value" variant="primary" size="sm" />
        </template>

        <!-- Custom Cell: Status -->
        <template #cell-status="{ value }">
          <Badge
            :label="value === 'active' ? 'Aktif' : 'Dicabut'"
            :variant="value === 'active' ? 'success' : 'danger'"
            show-dot
          />
        </template>

        <!-- Actions Column -->
        <template #actions="{ row }">
          <div class="flex items-center space-x-3">
            <button
              @click="viewDocument(row)"
              class="text-indigo-600 hover:text-indigo-900 transition"
              title="Lihat Detail"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              v-if="row.status === 'active'"
              @click="confirmRevoke(row)"
              class="text-red-600 hover:text-red-900 transition"
              title="Cabut Dokumen"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </template>
      </DataTable>

      <!-- Modal Detail Dokumen -->
      <Modal
        v-model="showDetailModal"
        title="Detail Dokumen"
        size="md"
        :show-confirm-button="false"
        cancel-text="Tutup"
      >
        <div v-if="selectedDoc" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Nama Dokumen</label>
            <p class="mt-1 text-gray-900">{{ selectedDoc.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Hash Dokumen</label>
            <div class="mt-1 bg-gray-100 p-3 rounded-lg">
              <p class="text-sm font-mono text-gray-900 break-all">{{ selectedDoc.hash }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Kategori</label>
              <p class="mt-1 text-gray-900">{{ selectedDoc.category }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tanggal Upload</label>
              <p class="mt-1 text-gray-900">{{ formatDate(selectedDoc.uploadDate) }}</p>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1">
              <Badge
                :label="selectedDoc.status === 'active' ? 'Aktif' : 'Dicabut'"
                :variant="selectedDoc.status === 'active' ? 'success' : 'danger'"
                show-dot
              />
            </p>
          </div>
        </div>
      </Modal>

      <!-- Modal Konfirmasi Revoke -->
      <Modal
        v-model="showRevokeModal"
        title="Konfirmasi Pencabutan"
        size="sm"
        confirm-text="Ya, Cabut"
        cancel-text="Batal"
        confirm-variant="danger"
        @confirm="handleRevoke"
      >
        <div class="text-center py-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p class="text-sm text-gray-600">
            Apakah Anda yakin ingin mencabut dokumen <strong>{{ selectedDoc?.name }}</strong>?
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </Modal>

      <!-- Loading Overlay -->
      <Loading
        v-if="isLoading"
        type="spinner"
        :full-screen="true"
        :overlay="true"
        text="Memproses..."
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import StatsCard from '@/components/StatsCard.vue'
import DataTable from '@/components/DataTable.vue'
import Badge from '@/components/Badge.vue'
import Modal from '@/components/Modal.vue'
import Alert from '@/components/Alert.vue'
import Loading from '@/components/Loading.vue'

const router = useRouter()

// State
const userData = ref({
  email: 'admin@example.com'
})

const documents = ref([])
const searchQuery = ref('')
const filterStatus = ref('')
const isLoading = ref(false)
const showDetailModal = ref(false)
const showRevokeModal = ref(false)
const selectedDoc = ref(null)
const showAlert = ref(false)
const alertVariant = ref('success')
const alertTitle = ref('')
const alertMessage = ref('')

const stats = ref({
  total: 0,
  active: 0,
  revoked: 0
})

// Table columns
const columns = [
  { key: 'name', label: 'Nama Dokumen' },
  { key: 'category', label: 'Kategori' },
  { key: 'uploadDate', label: 'Tanggal Upload' },
  { key: 'status', label: 'Status' }
]

// Filter options
const filterOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'revoked', label: 'Dicabut' }
]

// Computed
const filteredDocuments = computed(() => {
  let filtered = documents.value

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.hash.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(doc => doc.status === filterStatus.value)
  }

  return filtered
})

// Methods
const fetchDocuments = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch('/api/documents', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    
    documents.value = data.documents || []
    
    // Update stats
    stats.value.total = documents.value.length
    stats.value.active = documents.value.filter(d => d.status === 'active').length
    stats.value.revoked = documents.value.filter(d => d.status === 'revoked').length
  } catch (error) {
    console.error('Error fetching documents:', error)
    showAlertMessage('error', 'Error', 'Gagal memuat data dokumen')
  } finally {
    isLoading.value = false
  }
}

const viewDocument = (doc) => {
  selectedDoc.value = doc
  showDetailModal.value = true
}

const confirmRevoke = (doc) => {
  selectedDoc.value = doc
  showRevokeModal.value = true
}

const handleRevoke = async () => {
  if (!selectedDoc.value) return

  isLoading.value = true
  showRevokeModal.value = false

  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`/api/documents/${selectedDoc.value.id}/revoke`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      await fetchDocuments()
      showAlertMessage('success', 'Berhasil', 'Dokumen berhasil dicabut')
    } else {
      showAlertMessage('error', 'Gagal', 'Gagal mencabut dokumen')
    }
  } catch (error) {
    console.error('Error revoking document:', error)
    showAlertMessage('error', 'Error', 'Terjadi kesalahan saat mencabut dokumen')
  } finally {
    isLoading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  router.push('/login')
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const showAlertMessage = (variant, title, message) => {
  alertVariant.value = variant
  alertTitle.value = title
  alertMessage.value = message
  showAlert.value = true
}

// Lifecycle
onMounted(() => {
  // Load user data
  const storedUserData = localStorage.getItem('user_data')
  if (storedUserData) {
    userData.value = JSON.parse(storedUserData)
  }
  
  fetchDocuments()
})
</script>