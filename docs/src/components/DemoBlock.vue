<template>
  <section :id="id" class="docs-demo-block" data-anchor :data-anchor-title="title">
    <header class="docs-demo-block__header">
      <div>
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <Space v-if="source">
        <RadioGroup v-model="activeTab" type="button" size="small">
          <Radio value="preview">Preview</Radio>
          <Radio value="code">Code</Radio>
        </RadioGroup>
        <Button size="small" @click="copyCode">复制</Button>
      </Space>
    </header>

    <div v-show="activeTab === 'preview'" class="docs-demo-block__preview">
      <slot />
    </div>

    <div v-if="source" v-show="activeTab === 'code'" class="docs-demo-block__code">
      <div v-if="isHighlighting" class="docs-demo-block__code-loading">代码高亮加载中...</div>
      <div v-else-if="highlightedSource" class="docs-demo-block__highlight" v-html="highlightedSource"></div>
      <pre v-else><code>{{ normalizedSource }}</code></pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Button, Message, Radio, RadioGroup, Space } from '@arco-design/web-vue'
import { highlightCode } from '../utils/highlight'

const props = withDefaults(defineProps<{
  id: string
  title: string
  description?: string
  source?: string
  language?: string
}>(), {
  language: 'vue'
})

const activeTab = ref<'preview' | 'code'>('preview')
const highlightedSource = ref('')
const isHighlighting = ref(false)
const isDark = ref(false)
let highlightTaskId = 0
let themeObserver: MutationObserver | undefined

const normalizedSource = computed(() => props.source?.trim() || '')
const currentTheme = computed(() => (isDark.value ? 'github-dark' : 'github-light'))

function updateThemeState() {
  isDark.value =
    document.documentElement.classList.contains('dark') ||
    document.body.getAttribute('arco-theme') === 'dark'
}

async function renderHighlightedCode() {
  if (activeTab.value !== 'code' || !normalizedSource.value) {
    return
  }
  const taskId = ++highlightTaskId
  isHighlighting.value = true
  try {
    const html = await highlightCode(normalizedSource.value, {
      lang: props.language,
      theme: currentTheme.value
    })
    if (taskId === highlightTaskId) {
      highlightedSource.value = html
    }
  } catch (error) {
    if (taskId === highlightTaskId) {
      highlightedSource.value = ''
    }
    console.warn('[Docs] Failed to highlight source code.', error)
  } finally {
    if (taskId === highlightTaskId) {
      isHighlighting.value = false
    }
  }
}

async function copyCode() {
  if (!normalizedSource.value) return
  await navigator.clipboard.writeText(normalizedSource.value)
  Message.success('代码已复制')
}

onMounted(() => {
  updateThemeState()
  themeObserver = new MutationObserver(updateThemeState)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['arco-theme'] })
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
})

watch([activeTab, normalizedSource, currentTheme], renderHighlightedCode, { immediate: false })
</script>
