<template>
  <span
    class="brand-mark"
    :class="[`brand-mark--${size}`, { 'brand-mark--flat': flat }]"
    v-html="logoSvg"
  />
</template>

<script setup lang="ts">
import logoSvg from '../assets/logo.svg?raw'

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
