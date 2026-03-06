<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsStore } from '../../stores/news'

const store = useNewsStore()
const router = useRouter()

const searchQuery = ref('')
const typeFilter = ref<'all' | 'Customer' | 'Prospect'>('all')
const industryFilter = ref<string>('all')

const industries = computed(() => {
  const ind = new Set(store.accounts.map((a) => a.industry))
  return ['all', ...Array.from(ind)]
})

const filteredAccounts = computed(() => {
  return store.accountsWithMentions.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      account.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = typeFilter.value === 'all' || account.type === typeFilter.value
    const matchesIndustry =
      industryFilter.value === 'all' || account.industry === industryFilter.value

    return matchesSearch && matchesType && matchesIndustry
  })
})

function selectAccount(id: string) {
  store.setSelectedAccount(id)
  router.push(`/account/${id}`)
}

function clearFilter() {
  searchQuery.value = ''
  typeFilter.value = 'all'
  industryFilter.value = 'all'
  store.setSelectedAccount(null)
}
</script>

<template>
  <aside class="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
    <div class="p-5 border-b border-gray-200 bg-slate-50 sticky top-0 z-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900">Accounts</h2>
        <span class="text-xs font-semibold px-2 py-1 bg-red-50 text-red-700 rounded-full">
          {{ store.accounts.length }}
        </span>
      </div>

      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search accounts..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-white"
        />
      </div>

      <div class="mt-3 flex gap-2">
        <select
          v-model="typeFilter"
          class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
        >
          <option value="all">All Types</option>
          <option value="Customer">Customers</option>
          <option value="Prospect">Prospects</option>
        </select>

        <select
          v-model="industryFilter"
          class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
        >
          <option v-for="ind in industries" :key="ind" :value="ind">
            {{ ind === 'all' ? 'All' : ind }}
          </option>
        </select>
      </div>

      <button
        v-if="searchQuery || typeFilter !== 'all' || industryFilter !== 'all'"
        @click="clearFilter"
        class="mt-3 text-sm text-red-600 hover:text-red-700 font-semibold"
      >
        Clear filters
      </button>
    </div>

    <div class="divide-y divide-gray-100">
      <button
        @click="clearFilter"
        class="w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
        :class="{ 'bg-blue-900/5 border-l-4 border-red-600': !store.selectedAccountId }"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-lg bg-linear-to-br from-blue-900 to-blue-800 flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-gray-900">All Accounts</p>
            <p class="text-xs text-gray-500">{{ store.articles.length }} articles</p>
          </div>
        </div>
      </button>

      <button
        v-for="account in filteredAccounts"
        :key="account.id"
        @click="selectAccount(account.id)"
        class="w-full px-5 py-4 text-left hover:bg-gray-50 transition-all"
        :class="{
          'bg-blue-900/5 border-l-4 border-red-600': store.selectedAccountId === account.id,
        }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 min-w-0">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              :class="
                account.type === 'Customer'
                  ? 'bg-linear-to-br from-emerald-500 to-emerald-700'
                  : 'bg-linear-to-br from-amber-500 to-amber-700'
              "
            >
              <span class="text-white font-bold text-sm">{{ account.name.charAt(0) }}</span>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-gray-900 truncate">{{ account.name }}</p>
              <p class="text-xs text-gray-500">{{ account.industry }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end ml-2 shrink-0">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold"
              :class="
                account.type === 'Customer'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              "
            >
              {{ account.type }}
            </span>
            <span class="text-xs text-gray-400 mt-1">{{ account.mentionCount }} mentions</span>
          </div>
        </div>
      </button>
    </div>

    <div v-if="filteredAccounts.length === 0" class="p-8 text-center">
      <svg
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-gray-500 text-sm">No accounts found</p>
    </div>
  </aside>
</template>
