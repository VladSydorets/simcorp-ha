<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '../stores/news'
import ArticleList from '../components/articles/ArticleList.vue'

const route = useRoute()
const router = useRouter()
const store = useNewsStore()

const account = computed(() => {
  return store.getAccountById(route.params.id as string)
})

const accountArticles = computed(() => {
  if (!account.value) return []
  return store.articles.filter((article) => article.indices[account.value!.id])
})

const recentArticles = computed(() => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  return accountArticles.value.filter((a) => a.timestamp * 1000 >= thirtyDaysAgo).slice(0, 20)
})

onMounted(() => {
  if (account.value) {
    store.setSelectedAccount(account.value.id)
  }
})

function goToRecent() {
  router.push('/')
}

function goToAll() {
  router.push('/all')
}
</script>

<template>
  <div v-if="account">
    <button
      @click="router.back()"
      class="mb-6 flex items-center text-gray-600 hover:text-red-600 transition-colors font-semibold"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-4">
          <div
            class="w-16 h-16 rounded-lg flex items-center justify-center"
            :class="
              account.type === 'Customer'
                ? 'bg-linear-to-br from-emerald-500 to-emerald-700'
                : 'bg-linear-to-br from-amber-500 to-amber-700'
            "
          >
            <span class="text-white font-bold text-2xl">{{ account.name.charAt(0) }}</span>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">{{ account.name }}</h2>
            <p class="text-gray-600 font-semibold">{{ account.industry }}</p>
          </div>
        </div>
        <span
          class="inline-flex items-center px-4 py-2 rounded text-sm font-semibold"
          :class="
            account.type === 'Customer'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          "
        >
          {{ account.type }}
        </span>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 font-semibold">Total Articles</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ accountArticles.length }}</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 font-semibold">Last 30 Days</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ recentArticles.length }}</p>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button
          @click="goToRecent"
          class="px-6 py-2.5 bg-linear-to-r from-blue-900 to-blue-800 text-white rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all shadow-lg shadow-blue-900/25"
        >
          Recent News
        </button>
        <button
          @click="goToAll"
          class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Browse All
        </button>
      </div>
    </div>

    <div class="flex items-center space-x-3 mb-6">
      <div
        class="w-10 h-10 bg-linear-to-br from-blue-900 to-blue-800 rounded-lg flex items-center justify-center"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900">Recent Articles</h3>
    </div>

    <ArticleList
      :articles="recentArticles"
      :has-more="
        recentArticles.length <
        accountArticles.filter((a) => a.timestamp * 1000 >= Date.now() - 30 * 24 * 60 * 60 * 1000)
          .length
      "
      :is-loading="false"
      @load-more="() => {}"
    />
  </div>

  <div v-else class="text-center py-16">
    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <p class="text-gray-600 text-lg font-semibold">Account not found</p>
  </div>
</template>
