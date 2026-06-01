<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>组合输入器</h2>
      <p>将组合输入的"邮箱号"/"不动产证号"等场景的多组件组合进行原子化封装</p>
    </div>

    <Card class="demo-card">
      <template #title>
        <span>字符串模板模式</span>
      </template>
      <div class="demo-item">
        <AbComboInput
          v-model="stringTemplateValue"
          template="闽({year})永安市不动产权第{no}号"
          size="medium"
          @change="handleStringTemplateChange"
        />
        <div class="result">当前值: {{ stringTemplateValue }}</div>
        <div v-if="stringTemplateChangeEvent" class="event-result">
          Change事件: {{ JSON.stringify(stringTemplateChangeEvent) }}
        </div>
      </div>
    </Card>

    <Card class="demo-card">
      <template #title>
        <span>详细配置模式</span>
      </template>
      <div class="demo-item">
        <AbComboInput v-model="detailedTemplateValue" :template="detailedTemplate" size="medium" />
        <div class="result">当前值: {{ detailedTemplateValue }}</div>
      </div>
    </Card>

    <Card class="demo-card">
      <template #title>
        <span>不同尺寸</span>
      </template>
      <div class="demo-item">
        <AbComboInput v-model="smallValue" template="邮箱: {prefix}@{domain}.com" size="small" />
        <div class="result">当前值: {{ smallValue }}</div>
      </div>
      <div class="demo-item">
        <AbComboInput
          v-model="detailedTemplateValue"
          :template="detailedTemplate"
          size="medium"
          @change="handleDetailedTemplateChange"
        />
        <div class="result">当前值: {{ detailedTemplateValue }}</div>
        <div v-if="detailedTemplateChangeEvent" class="event-result">
          Change事件: {{ JSON.stringify(detailedTemplateChangeEvent) }}
        </div>
      </div>
      <div class="demo-item">
        <AbComboInput v-model="largeValue" template="邮箱: {prefix}@{domain}.com" size="large" />
        <div class="result">当前值: {{ largeValue }}</div>
      </div>
    </Card>

    <Card class="demo-card">
      <template #title>
        <span>禁用状态</span>
      </template>
      <div class="demo-item">
        <AbComboInput
          v-model="disabledValue"
          template="闽({year})永安市不动产权第{no}号"
          disabled
        />
        <div class="result">当前值: {{ disabledValue }}</div>
      </div>
    </Card>

    <Card class="demo-card feature-card">
      <template #title>
        <span>✨ 核心特性</span>
      </template>
      <ul class="feature-list">
        <li>🎯 支持字符串模板如 "闽({year})永安市不动产权第{no}号"</li>
        <li>🛠️ 支持详细配置模式，可自定义每个组件的属性</li>
        <li>🔄 自动解析 {xxx} 生成对应的输入框</li>
        <li>📏 支持 mini/small/medium/large 四种 Arco 原生尺寸</li>
        <li>🔒 支持禁用状态</li>
        <li>⚡ 双向绑定，实时更新完整值</li>
        <li>🧩 基于 Arco Design Vue 组件库</li>
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card } from '@arco-design/web-vue'
import { AbComboInput } from '@/components/ComboInput'
import type { ComboInputChangeEvent, ComboTemplate } from '@/components/ComboInput/src/types'

// 字符串模板模式
const stringTemplateValue = ref('')
const stringTemplateChangeEvent = ref<ComboInputChangeEvent | null>(null)
const handleStringTemplateChange = (event: ComboInputChangeEvent) => {
  stringTemplateChangeEvent.value = event
}

// 详细配置模式
const detailedTemplateValue = ref('')
const detailedTemplateChangeEvent = ref<ComboInputChangeEvent | null>(null)
const handleDetailedTemplateChange = (event: ComboInputChangeEvent) => {
  detailedTemplateChangeEvent.value = event
}

// 详细配置模式
const detailedTemplate: ComboTemplate[] = [
  {
    tag: 'span',
    content: '闽('
  },
  {
    tag: 'select',
    prop: 'year',
    componentProps: {
      placeholder: '选择年份',
      options: [
        { label: '2021', value: '2021' },
        { label: '2022', value: '22' },
        { label: '2023', value: '23' },
        { label: '2024', value: '24' }
      ]
    }
  },
  {
    tag: 'span',
    content: ')永安市不动产权第'
  },
  {
    tag: 'input',
    prop: 'no',
    componentProps: {
      placeholder: '输入编号'
    }
  },
  {
    tag: 'span',
    content: '号'
  }
]

// 不同尺寸
const smallValue = ref('')
const largeValue = ref('')

// 禁用状态
const disabledValue = ref('闽(22)永安市不动产权第12345号')
</script>

<style scoped>
.demo-item {
  margin-bottom: 16px;
}

.demo-item:last-child {
  margin-bottom: 0;
}

.result {
  margin-top: 8px;
  padding: 8px;
  background-color: var(--color-fill-1);
  border-radius: var(--border-radius-medium);
  font-size: 12px;
  color: var(--color-text-2);
}

.event-result {
  margin-top: 8px;
  padding: 8px;
  background-color: var(--color-primary-light-1);
  border-radius: var(--border-radius-medium);
  font-size: 12px;
  color: rgb(var(--primary-6));
  word-break: break-all;
}
</style>
