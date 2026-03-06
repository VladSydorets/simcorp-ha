<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '../../stores/news'

const route = useRoute()
const router = useRouter()
const store = useNewsStore()
const showHighlights = ref(false)

const article = computed(() => {
  return store.getArticleById(route.params.id as string)
})

const formattedDate = computed(() => {
  if (!article.value) return ''
  const date = new Date(article.value.timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

function highlightText(text: string, indices: [number, number][]): string {
  if (!indices || indices.length === 0) return escapeHtml(text)

  let result = ''
  let lastEnd = 0

  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0])

  for (const [start, end] of sortedIndices) {
    result += escapeHtml(text.substring(lastEnd, start))
    result += `<mark class="bg-amber-200 text-amber-900 font-semibold px-1 rounded transition-colors duration-300">${escapeHtml(text.substring(start, end))}</mark>`
    lastEnd = end
  }

  result += escapeHtml(text.substring(lastEnd))

  return result
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const highlightedTitle = computed(() => {
  if (!article.value) return ''

  if (!showHighlights.value) {
    return escapeHtml(article.value.title)
  }

  const indices = article.value.indices
  const allTitleIndices = Object.values(indices).flatMap((ind) => ind.title)

  return highlightText(article.value.title, allTitleIndices)
})

const highlightedText = computed(() => {
  if (!article.value) return ''
  const text = article.value.text.replace(/\n/g, ' ')

  if (!showHighlights.value) {
    return escapeHtml(text)
  }

  const indices = article.value.indices
  const allTextIndices = Object.values(indices).flatMap((ind) => ind.text)

  return highlightText(text, allTextIndices)
})

function goBack() {
  router.back()
}

onMounted(() => {
  nextTick(() => {
    // Attach click handlers to account links
    const articleContent = document.querySelector('.article-content')
    if (articleContent) {
      articleContent.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        if (target.classList.contains('account-link')) {
          const accountId = target.className.match(/account-(\w+)/)?.[1]
          if (accountId) {
            event.preventDefault()
            router.push(`/account/${accountId}`)
          }
        }
      })
    }
  })
})
</script>

<template>
  <div v-if="article" class="max-w-7xl mx-auto px-4 py-8">
    <button
      @click="goBack"
      class="mb-6 flex items-center text-gray-600 hover:text-red-600 transition-colors font-semibold"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <article class="bg-white">
      <!-- Article Header -->
      <header class="mb-8">
        <h1
          class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
          v-html="highlightedTitle"
        ></h1>

        <div class="flex items-center justify-between text-gray-600 border-b border-gray-200 pb-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm">{{ formattedDate }}</span>
            </div>

            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span class="text-sm font-medium">{{ article.source }}</span>
            </div>
          </div>

          <button
            @click="showHighlights = !showHighlights"
            :class="
              showHighlights ? 'bg-blue-100 text-blue-700 scale-105' : 'bg-gray-100 text-gray-700'
            "
            class="px-3 py-1.5 rounded text-sm font-medium transition-all duration-300 hover:opacity-80 cursor-pointer transform"
          >
            {{ showHighlights ? '✓ Highlights On' : 'Highlight Mentions' }}
          </button>
        </div>
      </header>

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none article-content">
        <p class="text-gray-700 leading-relaxed text-lg" v-html="highlightedText"></p>
      </div>
    </article>
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
    <p class="text-gray-600 text-lg font-semibold">Article not found</p>
  </div>
</template>
