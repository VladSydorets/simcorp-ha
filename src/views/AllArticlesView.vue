<script setup lang="ts">
import { computed } from 'vue'
import { useNewsStore } from '../stores/news'
import ArticleList from '../components/articles/ArticleList.vue'

const store = useNewsStore()

const allArticles = computed(() => store.paginatedArticles)
const hasMore = computed(() => store.hasMore)
const isLoading = computed(() => store.isLoading)

const selectedAccount = computed(() => {
  if (!store.selectedAccountId) return null
  return store.getAccountById(store.selectedAccountId)
})

function loadMore() {
  store.loadMore()
}
</script>

<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-2">
        <div
          class="w-12 h-12 bg-linear-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">
            All Articles
            <span v-if="selectedAccount" class="text-lg font-normal text-gray-600">
              — {{ selectedAccount.name }}
            </span>
          </h2>
        </div>
      </div>
      <p class="text-gray-600 ml-15">
        <span class="font-semibold text-gray-800">{{ store.filteredArticles.length }}</span> total
        articles
        <span v-if="store.selectedAccountId">
          mentioning <span class="font-semibold text-red-600">{{ selectedAccount?.name }}</span>
        </span>
      </p>
    </div>

    <ArticleList
      :articles="allArticles"
      :has-more="hasMore"
      :is-loading="isLoading"
      @load-more="loadMore"
    />
  </div>
</template>
