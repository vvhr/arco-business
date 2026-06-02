<template>
  <section :id="id" class="docs-demo-block" data-anchor :data-anchor-title="title">
    <header class="docs-demo-block__header">
      <div>
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <Space v-if="source">
        <RadioGroup v-model="activeTab" type="button" size="small">
          <Radio value="preview">Preview</Radio>
          <Radio value="code">Code</Radio>
        </RadioGroup>
        <Button size="small" @click="copyCode">复制</Button>
      </Space>
    </header>

    <div v-show="activeTab === 'preview'" class="docs-demo-block__preview">
      <slot />
    </div>

    <div v-if="source" v-show="activeTab === 'code'" class="docs-demo-block__code">
      <pre><code>{{ normalizedSource }}</code></pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Message, Radio, RadioGroup, Space } from '@arco-design/web-vue'

const props = defineProps<{
  id: string
  title: string
  description?: string
  source?: string
}>()

const activeTab = ref<'preview' | 'code'>('preview')

const normalizedSource = computed(() => props.source?.trim() || '')

async function copyCode() {
  if (!normalizedSource.value) return
  await navigator.clipboard.writeText(normalizedSource.value)
  Message.success('代码已复制')
}
</script>
