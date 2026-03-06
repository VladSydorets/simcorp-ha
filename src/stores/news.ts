import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, Article, AccountWithMention } from '../types'

export const useNewsStore = defineStore('news', () => {
  const accounts = ref<Account[]>([])
  const articles = ref<Article[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedAccountId = ref<string | null>(null)
  const pageSize = 20
  const currentPage = ref(1)

  const filteredArticles = computed(() => {
    if (!selectedAccountId.value) return articles.value
    return articles.value.filter((article) => article.indices[selectedAccountId.value as string])
  })

  const paginatedArticles = computed(() => {
    const start = 0
    const end = currentPage.value * pageSize
    return filteredArticles.value.slice(start, end)
  })

  const hasMore = computed(() => {
    return paginatedArticles.value.length < filteredArticles.value.length
  })

  const recentArticles = computed(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    return filteredArticles.value
      .filter((a) => a.timestamp * 1000 >= thirtyDaysAgo)
      .sort((a, b) => b.timestamp - a.timestamp)
  })

  const paginatedRecentArticles = computed(() => {
    return recentArticles.value.slice(0, currentPage.value * pageSize)
  })

  const hasMoreRecent = computed(() => {
    return paginatedRecentArticles.value.length < recentArticles.value.length
  })

  const accountsWithMentions = computed((): AccountWithMention[] => {
    const mentionCounts: Record<string, number> = {}

    articles.value.forEach((article) => {
      Object.keys(article.indices).forEach((accountId) => {
        const indices = article.indices[accountId]
        if (indices) {
          const titleCount = indices.title.length
          const textCount = indices.text.length
          mentionCounts[accountId] = (mentionCounts[accountId] || 0) + titleCount + textCount
        }
      })
    })

    return accounts.value.map((account) => ({
      ...account,
      mentionCount: mentionCounts[account.id] || 0,
    }))
  })

  const getAccountById = computed(() => {
    return (id: string) => accounts.value.find((a) => a.id === id)
  })

  const getArticleById = computed(() => {
    return (id: string) => articles.value.find((a) => a.id === id)
  })

  function loadAccounts(data: Account[]) {
    accounts.value = data
  }

  function loadArticles(data: Article[]) {
    const articlesWithIds = data.map((article, index) => ({
      ...article,
      id: index.toString(),
    }))
    articles.value = articlesWithIds.sort((a, b) => b.timestamp - a.timestamp)
  }

  function setSelectedAccount(id: string | null) {
    selectedAccountId.value = id
    currentPage.value = 1
  }

  function loadMore() {
    currentPage.value++
  }

  function refresh() {
    currentPage.value = 1
  }

  return {
    accounts,
    articles,
    isLoading,
    error,
    selectedAccountId,
    filteredArticles,
    paginatedArticles,
    hasMore,
    recentArticles,
    paginatedRecentArticles,
    hasMoreRecent,
    accountsWithMentions,
    getAccountById,
    getArticleById,
    loadAccounts,
    loadArticles,
    setSelectedAccount,
    loadMore,
    refresh,
  }
})
