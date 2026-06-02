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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbComboInput, type ComboTemplate } from '@/components/ComboInput'

const stringValue = ref('')
const detailValue = ref('')
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
</script>
