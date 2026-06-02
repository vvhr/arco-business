<template>
  <div class="docs-panel">
    <AbText icon="ep:info-filled" value="这是一条带图标的信息提示，适合页面辅助说明。" />
    <AbText dot-status="success" dot-type="shadow" value="成功状态，带阴影圆点" />
    <AbText dot-status="warning" dot-size="large" value="风险状态，使用更大的圆点强调优先级" />
    <AbText
      block
      block-status="warning"
      icon="ep:warning-filled"
      value="块样式适合展示流程备注、风险提示、审批意见等需要扫读的复杂文本。"
    />
    <AbText
      value="Vue 3 与 Arco Design Vue 共同构成组件库基础。"
      :patterns="['Vue 3', 'Arco Design Vue']"
      :copyable="true"
      @hl-click="handleClick"
    />
    <AbText
      :value="longText"
      :patterns="['配置驱动', '上下文透传']"
      :truncate="2"
      expandable
      copyable
      @hl-click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { AbText } from '@/components/Text'

const longText = '配置驱动让表单和表格的业务规则可以沉淀为稳定 schema，上下文透传让字段显隐、动态选项、操作权限和校验规则可以共享页面状态。文本组件在备注、提示、状态说明中负责高效承载这些长文本，并提供裁剪、展开、高亮和复制能力。'

function handleClick(value: string) {
  Message.info(`点击了 ${value}`)
}
</script>
