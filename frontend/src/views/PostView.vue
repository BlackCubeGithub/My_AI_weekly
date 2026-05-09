<template>
  <div class="post-view">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading post...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <router-link :to="{ name: 'home' }" class="back-link">
        ← Back to Home
      </router-link>
    </div>

    <article v-else-if="post" class="post-detail">
      <router-link :to="{ name: 'home' }" class="back-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        {{ backLinkText }}
      </router-link>

      <header class="post-header">
        <h1 class="post-title-main">{{ post.title }}</h1>
        <div class="post-meta">
          <span>{{ formatDate(post.date) }}</span>
          <span v-if="post.lang" :class="['post-lang-badge', post.lang]" style="margin-left: 0.5rem;">
            {{ post.lang.toUpperCase() }}
          </span>
        </div>
      </header>

      <div class="post-content" v-html="processedContent"></div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPost } from '../utils/posts.js'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const route = useRoute()
const currentLang = inject('currentLang', ref('all'))

const post = ref(null)
const loading = ref(true)
const error = ref(null)

const backLinkText = computed(() => {
  const lang = currentLang.value
  if (lang === 'zh') return '← 返回首页'
  if (lang === 'en') return '← Back to Home'
  return '← Back to Home'
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const processedContent = computed(() => {
  if (!post.value || !post.value.content) return ''

  let content = post.value.content

  content = content.replace(/⭐️\s*([\d.]+)\/10/g, (match, score) => {
    const num = parseFloat(score)
    let tier = 'low'
    if (num >= 9) tier = 'high'
    else if (num >= 7) tier = 'good'
    else if (num >= 5) tier = 'mid'

    return `<span class="score-badge" data-tier="${tier}">${score}</span>`
  })

  return content
})

const loadPost = async () => {
  loading.value = true
  error.value = null
  post.value = null

  try {
    const slug = props.slug || route.params.slug
    post.value = await fetchPost(slug)
  } catch (e) {
    error.value = 'Failed to load post'
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(() => props.slug, () => {
  loadPost()
})

watch(() => route.params.slug, () => {
  loadPost()
})

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-view {
  width: 100%;
}

.post-title-main {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--hz-text);
  margin-bottom: var(--hz-space-md);
  line-height: 1.3;
}

.error-state {
  text-align: center;
  padding: var(--hz-space-xl);
  color: var(--hz-text-muted);
}
</style>
