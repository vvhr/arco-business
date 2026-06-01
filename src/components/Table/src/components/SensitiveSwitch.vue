<template>
  <span
    class="ab-table-sensitive"
    tabindex="0"
    role="button"
    :aria-label="isHovering ? `原始值: ${originValue}` : `已加密值: ${cryptoValue}`"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <span v-if="isHovering" class="ab-table-sensitive__origin" aria-hidden="true">
      {{ originValue }}
    </span>
    <span v-else class="ab-table-sensitive__crypto" aria-hidden="true">
      {{ cryptoValue }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  originValue: string | number
  cryptoValue: string | number
  enable: boolean
}>()

const isHovering = ref(false)

function handleMouseEnter() {
  if (props.enable) isHovering.value = true
}

function handleMouseLeave() {
  if (props.enable) isHovering.value = false
}

function handleFocusIn() {
  if (props.enable) isHovering.value = true
}

function handleFocusOut() {
  if (props.enable) isHovering.value = false
}
</script>

<style scoped lang="less">
.ab-table-sensitive {
  display: inline-block;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(var(--primary-6), 0.2);
    border-radius: 2px;
  }
}
</style>
