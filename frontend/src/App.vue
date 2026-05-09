<template>
  <div id="app">
    <header class="page-header">
      <h1>Horizon Daily</h1>
      <p class="subtitle">{{ subtitleText }}</p>
      <div class="lang-toggle">
        <button
          :class="{ active: currentLang === 'all' }"
          @click="setLang('all')"
        >
          All
        </button>
        <button
          :class="{ active: currentLang === 'zh' }"
          @click="setLang('zh')"
        >
          中文
        </button>
        <button
          :class="{ active: currentLang === 'en' }"
          @click="setLang('en')"
        >
          English
        </button>
      </div>
    </header>
    <main class="main-container">
      <router-view :lang="currentLang" />
    </main>
    <footer class="footer">
      <p>
        Powered by <a href="https://github.com/thysrael/Horizon" target="_blank" rel="noopener">Horizon</a> ·
        AI-driven daily digest
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, provide, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentLang = ref('all')

const subtitleText = computed(() => {
  switch (currentLang.value) {
    case 'zh':
      return 'AI 驱动的每日科技资讯速递'
    case 'en':
      return 'AI-driven daily tech digest'
    default:
      return 'AI 驱动的每日科技资讯速递'
  }
})

const setLang = (lang) => {
  currentLang.value = lang
}

provide('currentLang', currentLang)
provide('setLang', setLang)

watch(currentLang, (newLang) => {
  if (route.name !== 'home') {
    router.push({ name: 'home' })
  }
})
</script>

<style scoped>
/* Component-specific styles are in horizon.css */
</style>
