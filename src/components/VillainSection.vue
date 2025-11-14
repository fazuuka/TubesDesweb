<template>
  <section class="flex flex-col justify-center items-center text-center h-screen bg-gradient-to-b from-violet-400 to-cyan text-white">
    <div class="animate-fadeIn">
      <h1 class="text-5xl font-bold mb-6">Pastikan Keaslian Dokumen Akademikmu</h1>
      <p class="text-lg mb-8 max-w-2xl mx-auto">
        Jangan Seperti Jokowi
      </p>
      <button
        @click="$emit('get-started')"
        class="px-8 py-3 bg-white text-violet-400 rounded-full font-semibold shadow-md hover:bg-blue-400 hover:text-white transition-all ease-in-out duration-300"
      >
        Get Started
      </button>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0;  }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 1.2s ease-in-out forwards;
}
</style>