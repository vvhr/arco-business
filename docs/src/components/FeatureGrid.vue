<template>
  <div class="docs-feature-grid">
    <article v-for="item in items" :key="item.title" class="docs-feature">
      <strong>{{ item.title }}</strong>
      <span>{{ item.description }}</span>
    </article>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    title: string
    description: string
  }>
}>()
</script>
