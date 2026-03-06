<script setup lang="ts">
import { onMounted } from 'vue'
import { useNewsData } from './composables/useNewsData'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'

const { loadData, isLoading } = useNewsData()

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppHeader />

    <div class="flex">
      <AppSidebar />

      <main class="flex-1 p-8 overflow-y-auto" style="max-height: calc(100vh - 64px)">
        <div v-if="isLoading" class="flex items-center justify-center h-64">
          <div class="flex flex-col items-center">
            <div
              class="w-12 h-12 border-4 border-gray-200 border-t-blue-900 rounded-full animate-spin mb-4"
            ></div>
            <p class="text-gray-600 font-semibold">Loading articles...</p>
          </div>
        </div>
        <router-view v-else />
      </main>
    </div>
  </div>
</template>
