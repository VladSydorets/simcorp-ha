<script setup lang="ts">
import ArticleCard from './ArticleCard.vue'

defineProps<{
  articles: any[]
  hasMore: boolean
  isLoading: boolean
}>()

const emit = defineEmits<{
  loadMore: []
}>()
</script>

<template>
  <div>
    <div v-if="articles.length === 0 && !isLoading" class="text-center py-16">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <p class="text-gray-600 text-lg font-semibold">No articles found</p>
      <p class="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
    </div>

    <div v-else class="space-y-4">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />

      <div v-if="hasMore" class="flex justify-center py-8">
        <button
          @click="emit('loadMore')"
          :disabled="isLoading"
          class="px-8 py-3 bg-linear-to-r from-blue-900 to-blue-800 text-white rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all shadow-lg shadow-blue-900/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span v-if="isLoading">
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span v-else>Load More Articles</span>
        </button>
      </div>

      <div v-else-if="articles.length > 0" class="text-center py-8 text-gray-400 text-sm">
        <div class="flex items-center justify-center space-x-2">
          <span class="w-8 h-px bg-gray-300"></span>
          <span>You've reached the end</span>
          <span class="w-8 h-px bg-gray-300"></span>
        </div>
      </div>
    </div>
  </div>
</template>
