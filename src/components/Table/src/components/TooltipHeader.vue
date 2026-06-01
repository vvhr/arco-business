<template>
  <div class="ab-table-tooltip-header">
    <span class="ab-table-tooltip-header__title">{{ title }}</span>
    <Tooltip v-if="subLabel" :content="subLabel" :disabled="!isOverflow" position="top">
      <div
        ref="subLabelRef"
        class="ab-table-tooltip-header__subtitle"
        @mouseenter="checkOverflowOnHover"
      >
        {{ subLabel }}
      </div>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Tooltip } from '@arco-design/web-vue'

const props = defineProps<{
  title?: string
  subLabel?: string
}>()

const subLabelRef = ref<HTMLElement>()
const isOverflow = ref(false)
const hasChecked = ref(false)

function checkOverflowOnHover() {
  if (!subLabelRef.value || !props.subLabel || hasChecked.value) return

  const element = subLabelRef.value
  isOverflow.value = element.scrollWidth > element.clientWidth
  hasChecked.value = true
}

watch(
  () => props.subLabel,
  () => {
    hasChecked.value = false
    isOverflow.value = false
  }
)
</script>

<style scoped lang="less">
.ab-table-tooltip-header {
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  line-height: 1;

  &__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__subtitle {
    color: var(--color-text-3);
    font-size: clamp(12px, calc(1em - 1px), 16px);
    font-weight: 400;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
