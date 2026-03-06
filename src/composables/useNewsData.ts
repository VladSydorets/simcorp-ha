import { ref } from 'vue'
import { useNewsStore } from '../stores/news'
import accountsData from '../../data/accounts.json'
import articlesData from '../../data/articles.json'
import type { Account, Article } from '../types'

export function useNewsData() {
  const store = useNewsStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadData(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 100))

      store.loadAccounts(accountsData as unknown as Account[])
      store.loadArticles(articlesData as unknown as Article[])
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load data'
    } finally {
      isLoading.value = false
    }
  }

  async function refreshData(): Promise<void> {
    store.refresh()
    await loadData()
  }

  return {
    isLoading,
    error,
    loadData,
    refreshData,
  }
}
