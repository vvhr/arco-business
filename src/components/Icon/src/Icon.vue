<script setup lang="ts">
import { computed } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import type { CSSProperties } from 'vue'
import type { IconProps } from './types'

defineOptions({
  name: 'AbIcon',
  inheritAttrs: false
})

const props = withDefaults(defineProps<IconProps>(), {
  size: 16
})

const isLocal = computed(() => props.icon.startsWith('svg-icon:'))

const symbolId = computed(() => {
  return isLocal.value ? `#icon-${props.icon.slice('svg-icon:'.length)}` : props.icon
})

const iconStyle = computed<CSSProperties>(() => {
  const { color, size } = props
  return {
    fontSize: typeof size === 'number' ? `${size}px` : size,
    color
  }
})
</script>

<template>
  <span class="ab-icon" :style="iconStyle" v-bind="$attrs">
    <svg v-if="isLocal" aria-hidden="true">
      <use :href="symbolId" />
    </svg>

    <IconifyIcon v-else :icon="symbolId" />
  </span>
</template>

<style scoped lang="less">
.ab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  color: inherit;
  vertical-align: -0.125em;
}

.ab-icon svg {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
