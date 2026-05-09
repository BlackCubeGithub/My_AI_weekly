<template>
  <div class="home-view">
    <h2 class="section-title">{{ sectionTitle }}</h2>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading posts...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadPosts">Retry</button>
    </div>

    <ul v-else-if="filteredPosts.length > 0" class="post-list">
      <li
        v-for="post in filteredPosts"
        :key="post.slug"
        class="post-list-item"
      >
        <router-link :to="{ name: 'post', params: { slug: post.slug } }">
          <div class="post-date">{{ formatDate(post.date) }}</div>
          <div class="post-title">
            {{ post.title }}
            <span :class="['post-lang-badge', post.lang]">{{ post.lang.toUpperCase() }}</span>
          </div>
        </router-link>
      </li>
    </ul>

    <div v-else class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z"/>
      </svg>
      <p>{{ emptyText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { fetchAllPosts } from '../utils/posts.js'

const props = defineProps({
  lang: {
    type: String,
    default: 'all'
  }
})

const posts = ref([])
const loading = ref(true)
const error = ref(null)

const filteredPosts = computed(() => {
  if (props.lang === 'all') {
    return posts.value
  }
  return posts.value.filter(post => post.lang === props.lang)
})

const sectionTitle = computed(() => {
  switch (props.lang) {
    case 'zh':
      return '每日速递'
    case 'en':
      return 'Daily Digest'
    default:
      return '每日速递'
  }
})

const emptyText = computed(() => {
  switch (props.lang) {
    case 'zh':
      return '暂无内容'
    case 'en':
      return 'No posts yet'
    default:
      return '暂无内容'
  }
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const loadPosts = async () => {
  loading.value = true
  error.value = null
  try {
    posts.value = await fetchAllPosts()
  } catch (e) {
    error.value = 'Failed to load posts'
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(() => props.lang, () => {
  // Posts are already filtered reactively
})

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.home-view {
  width: 100%;
}

.error-state {
  text-align: center;
  padding: var(--hz-space-xl);
  color: var(--hz-text-muted);
}

.error-state button {
  margin-top: var(--hz-space-md);
  padding: var(--hz-space-sm) var(--hz-space-lg);
  background: var(--hz-accent);
  color: #fff;
  border: none;
  border-radius: var(--hz-radius-sm);
  cursor: pointer;
}

.error-state button:hover {
  background: var(--hz-accent-hover);
}
</style>
