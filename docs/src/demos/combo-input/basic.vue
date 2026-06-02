<template>
  <div class="docs-panel">
    <AbComboInput
      v-model="stringValue"
      template="闽({year})永安市不动产权第{no}号"
      size="medium"
    />
    <div class="docs-demo-state">
      <pre>{{ stringValue }}</pre>
    </div>
    <AbComboInput v-model="detailValue" :template="detailTemplate" size="medium" />
    <div class="docs-demo-state">
      <pre>{{ detailValue }}</pre>
    </div>
    <AbComboInput v-model="contractValue" :template="contractTemplate" size="medium" @change="handleChange" />
    <div class="docs-demo-state">
      <pre>{{ contractValue }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { AbComboInput, type ComboTemplate } from '@/components/ComboInput'

const stringValue = ref('')
const detailValue = ref('')
const contractValue = ref('')
const detailTemplate: ComboTemplate[] = [
  { tag: 'span', content: '邮箱: ' },
  { tag: 'input', prop: 'prefix', componentProps: { placeholder: '账号' } },
  { tag: 'span', content: '@' },
  {
    tag: 'select',
    prop: 'domain',
    componentProps: {
      placeholder: '域名',
      options: [
        { label: 'example.com', value: 'example.com' },
        { label: 'acro.dev', value: 'acro.dev' }
      ]
    }
  }
]

const contractTemplate: ComboTemplate[] = [
  { tag: 'span', content: 'HT-' },
  {
    tag: 'select',
    prop: 'company',
    componentProps: {
      placeholder: '主体',
      options: [
        { label: 'BJ', value: 'BJ' },
        { label: 'SH', value: 'SH' }
      ]
    }
  },
  { tag: 'span', content: '-' },
  { tag: 'date-picker', prop: 'date', componentProps: { valueFormat: 'YYYYMMDD' } },
  { tag: 'span', content: '-' },
  { tag: 'input', prop: 'no', componentProps: { placeholder: '流水号', maxLength: 4 } }
]

function handleChange(event: { params: Record<string, any> }) {
  Message.info(`模板参数：${JSON.stringify(event.params)}`)
}
</script>
