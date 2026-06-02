<template>
  <RouterView v-if="isHome" />
  <div v-else class="docs-app">
    <aside class="docs-sidebar">
      <RouterLink class="docs-brand" to="/">
        <BrandMark size="sm" />
      </RouterLink>

      <nav class="docs-nav" aria-label="文档导航">
        <section v-for="group in navGroups" :key="group.title" class="docs-nav__group">
          <h2>{{ group.title }}</h2>
          <RouterLink
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            class="docs-nav__link"
          >
            {{ item.label }}
          </RouterLink>
        </section>
      </nav>
    </aside>

    <div class="docs-shell">
      <header class="docs-toolbar">
        <div>
          <span class="docs-toolbar__eyebrow">Vue 3 + Arco Design Vue</span>
          <h1>{{ currentTitle }}</h1>
        </div>
        <Space>
          <Button href="https://github.com/vvhr/arco-business" target="_blank">GitHub</Button>
          <Switch v-model="isDark" @change="toggleTheme">
            <template #checked-icon>
              <icon-moon-fill />
            </template>
            <template #unchecked-icon>
              <icon-sun-fill />
            </template>
          </Switch>
        </Space>
      </header>

      <main class="docs-main">
        <RouterView />
      </main>

      <aside class="docs-toc" aria-label="章节导航">
        <strong>本页目录</strong>
        <a v-for="item in anchors" :key="item.id" href="#" @click.prevent="scrollToAnchor(item.id)">
          {{ item.title }}
        </a>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Button, Space, Switch } from '@arco-design/web-vue'
import { navGroups } from '../router'
import BrandMark from '../components/BrandMark.vue'

const route = useRoute()
const isDark = ref(false)
const anchors = ref<Array<{ id: string; title: string }>>([])
const isHome = computed(() => route.path === '/')

const currentTitle = computed(() => {
  for (const group of navGroups) {
    const item = group.items.find(nav => nav.path === route.path)
    if (item) return item.label
  }
  return 'Acro Business'
})

function applyTheme(value: boolean) {
  if (value) {
    document.documentElement.classList.add('dark')
    document.body.setAttribute('arco-theme', 'dark')
    localStorage.setItem('docs-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.body.removeAttribute('arco-theme')
    localStorage.setItem('docs-theme', 'light')
  }
}

function toggleTheme(value: boolean | string | number) {
  applyTheme(Boolean(value))
}

async function collectAnchors() {
  await nextTick()
  anchors.value = Array.from(document.querySelectorAll<HTMLElement>('[data-anchor][id]'))
    .map(element => ({
      id: element.id,
      title: element.dataset.anchorTitle || element.textContent?.trim() || element.id
    }))
    .filter(item => item.id && item.title)
}

function scrollToAnchor(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

onMounted(() => {
  isDark.value = localStorage.getItem('docs-theme') === 'dark'
  applyTheme(isDark.value)
  collectAnchors()
})

watch(() => route.fullPath, collectAnchors)
</script>
