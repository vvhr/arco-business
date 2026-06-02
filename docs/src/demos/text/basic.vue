<template>
  <div class="docs-panel">
    <AbText icon="ep:info-filled" value="这是一条带图标的信息提示" />
    <AbText dot-status="success" dot-type="shadow" value="成功状态，带阴影圆点" />
    <AbText
      block
      block-status="warning"
      icon="ep:warning-filled"
      value="引用块适合展示需要强调的业务提示。"
    />
    <AbText
      value="Vue 3 与 Arco Design Vue 共同构成组件库基础。"
      :patterns="['Vue 3', 'Arco Design Vue']"
      :copyable="true"
      @hl-click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { AbText } from '@/components/Text'

function handleClick(value: string) {
  Message.info(`点击了 ${value}`)
}
</script>
