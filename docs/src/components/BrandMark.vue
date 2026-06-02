<template>
  <span class="brand-mark" :class="[`brand-mark--${size}`, { 'brand-mark--flat': flat }]">
    <span class="brand-mark__grid" />
    <span class="brand-mark__path" />
    <span class="brand-mark__core" />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    flat?: boolean
  }>(),
  {
    size: 'md',
    flat: false
  }
)
</script>
