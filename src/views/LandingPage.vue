<template>
  <div>
    <VillainSection @get-started="goToCareer" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import VillainSection from '../components/VillainSection.vue'

const router = useRouter()
const goToCareer = () => router.push('/verify-upload')
</script>