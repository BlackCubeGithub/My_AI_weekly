import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

md.use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.headerLink(),
  slugify: s => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
})

export function parseMarkdown(content) {
  return md.render(content)
}

export function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content: content }
  }

  const frontmatterStr = match[1]
  const bodyContent = match[2]
  const data = {}

  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      data[key] = value
    }
  })

  return { data, content: bodyContent }
}

export function parsePostSlug(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
  if (match) {
    return { date: match[1], slug: match[2] }
  }
  return null
}

export function getScoreTier(score) {
  const num = parseFloat(score)
  if (num >= 9) return 'high'
  if (num >= 7) return 'good'
  if (num >= 5) return 'mid'
  return 'low'
}

// Glob import all markdown files from ../../../docs/_posts (project root docs)
const postModules = import.meta.glob([
  '../../../docs/_posts/*.md',
], {
  query: '?raw',
  import: 'default',
  eager: true
})

const postsCache = new Map()

function processPostModule(path, rawContent) {
  const filename = path.split('/').pop()
  const { date, slug } = parsePostSlug(filename) || { slug: filename.replace('.md', '') }
  const { data, content: bodyContent } = extractFrontmatter(rawContent)

  return {
    slug: data.title ? slug : filename.replace('.md', ''),
    title: data.title || slug,
    date: data.date || date,
    lang: data.lang || 'zh',
    content: parseMarkdown(bodyContent),
    rawContent: rawContent
  }
}

export async function fetchAllPosts() {
  if (postsCache.size > 0) {
    return Array.from(postsCache.values()).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  }

  const posts = []

  for (const [path, rawContent] of Object.entries(postModules)) {
    const post = processPostModule(path, rawContent)
    posts.push(post)
    postsCache.set(post.slug, post)
  }

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function fetchPost(slug) {
  if (postsCache.has(slug)) {
    return postsCache.get(slug)
  }

  const allPosts = await fetchAllPosts()
  const post = allPosts.find(p => p.slug === slug)

  if (!post) {
    throw new Error(`Post not found: ${slug}`)
  }

  return post
}

export async function fetchPostsByLang(lang) {
  const allPosts = await fetchAllPosts()
  if (lang === 'all') return allPosts
  return allPosts.filter(post => post.lang === lang)
}
