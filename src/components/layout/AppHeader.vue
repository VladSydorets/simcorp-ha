<script setup lang="ts">
import { useNewsStore } from '../../stores/news'

const store = useNewsStore()
</script>

<template>
  <header class="bg-slate-900 shadow-lg border-b-4 border-red-600">
    <div class="mx-auto px-8 sm:px-8 lg:px-10 py-2">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-white tracking-tight">
            <router-link
              to="/"
              class="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <svg
                class="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span>SimCorp News</span>
            </router-link>
          </h1>
        </div>

        <div class="flex items-center space-x-4">
          <nav class="flex space-x-1">
            <router-link
              to="/"
              @click="store.setSelectedAccount(null)"
              class="px-4 py-2 rounded text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all border-b-2 border-transparent"
              active-class="text-white border-b-red-500"
            >
              Recent
            </router-link>
            <router-link
              to="/all"
              @click="store.setSelectedAccount(null)"
              class="px-4 py-2 rounded text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all border-b-2 border-transparent"
              active-class="text-white border-b-red-500"
            >
              All Articles
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>
