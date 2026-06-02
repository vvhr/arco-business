<template>
  <section class="docs-page-header">
    <div class="docs-page-header__brand">
      <BrandMark flat />
      <span>{{ eyebrow }}</span>
    </div>
    <h2>{{ title }}</h2>
    <div v-if="description" class="docs-page-header__description">{{ description }}</div>
    <div v-if="tags?.length" class="docs-page-header__tags">
      <span v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import BrandMark from './BrandMark.vue'

defineProps<{
  title: string
  eyebrow: string
  description?: string
  tags?: string[]
}>()
</script>
