<template>
  <Tag
    :color="tagColor"
    :bordered="hit || effect === 'plain'"
    :class="['ab-table-dot-tag', `is-${effect}`, { 'is-round': round }]"
    :style="{ '--ab-dot-color': dotColor }"
  >
    <span class="ab-table-dot-tag__dot"></span>
    <span class="ab-table-dot-tag__text">{{ value }}</span>
  </Tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Tag } from '@arco-design/web-vue'

const props = withDefaults(
  defineProps<{
  value: string
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
    color?: string
    hit?: boolean
    effect?: 'dark' | 'light' | 'plain'
    round?: boolean
  }>(),
  {
    value: '',
    type: 'primary',
    color: '',
    hit: false,
    effect: 'dark',
    round: false
  }
)

const colorMap = {
  primary: 'arcoblue',
  success: 'green',
  info: 'gray',
  warning: 'orange',
  danger: 'red'
}

const cssColorMap = {
  primary: 'rgb(var(--primary-6))',
  success: 'rgb(var(--success-6))',
  info: 'rgb(var(--gray-6))',
  warning: 'rgb(var(--warning-6))',
  danger: 'rgb(var(--danger-6))'
}

const tagColor = computed(() => props.color || colorMap[props.type])
const dotColor = computed(() => props.color || cssColorMap[props.type])
</script>

<style scoped lang="less">
.ab-table-dot-tag {
  display: inline-flex;
  align-items: center;
  width: fit-content;

  &.is-round {
    border-radius: 999px;
  }

  &.is-plain {
    background: transparent;
  }

  &__text {
    color: var(--color-text-2);
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ab-dot-color);
    box-shadow: 0 0 4px var(--ab-dot-color);
    display: inline-block;
    flex: 0 0 auto;
    margin-right: 4px;
  }
}
</style>
