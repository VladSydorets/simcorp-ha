<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsStore } from '../../stores/news'
import type { Article } from '../../types'

const props = defineProps<{
  article: Article
}>()

const router = useRouter()
const store = useNewsStore()

const formattedDate = computed(() => {
  const date = new Date(props.article.timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

const mentionedAccounts = computed(() => {
  const accountIds = Object.keys(props.article.indices)
  return accountIds
    .map((id) => store.getAccountById(id))
    .filter(Boolean)
    .map((account) => ({
      id: account!.id,
      name: account!.name,
      type: account!.type,
    }))
})

const snippet = computed(() => {
  const text = props.article.text.replace(/\n/g, ' ')
  return text.length > 150 ? text.substring(0, 150) + '...' : text
})

const timeAgo = computed(() => {
  const now = Date.now()
  const articleTime = props.article.timestamp * 1000
  const diffMs = now - articleTime
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return formattedDate.value
})

function goToArticle() {
  router.push(`/article/${props.article.id}`)
}
</script>

<template>
  <article
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-red-200 transition-all cursor-pointer group"
    @click="goToArticle"
  >
    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium text-gray-500">{{ timeAgo }}</span>
        <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span class="text-sm font-semibold text-red-600">{{ article.source }}</span>
      </div>
    </div>

    <h3
      class="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-900 transition-colors"
    >
      {{ article.title }}
    </h3>

    <p class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
      {{ snippet }}
    </p>

    <div class="flex flex-wrap gap-2">
      <router-link
        v-for="account in mentionedAccounts"
        :key="account.id"
        :to="`/account/${account.id}`"
        @click.stop
        class="inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold transition-colors"
        :class="
          account.type === 'Customer'
            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
        "
      >
        {{ account.name }}
      </router-link>
    </div>
  </article>
</template>
