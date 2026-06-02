<template>
  <section :id="id" class="docs-section" data-anchor :data-anchor-title="title">
    <header class="docs-section__header">
      <p v-if="kicker">{{ kicker }}</p>
      <h3>{{ title }}</h3>
      <div v-if="description" class="docs-section__description">{{ description }}</div>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  title: string
  kicker?: string
  description?: string
}>()
</script>
