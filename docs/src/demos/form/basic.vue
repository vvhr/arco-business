<template>
  <div class="docs-panel">
    <Space wrap>
      <Select v-model="layout" size="small" :style="{ width: '132px' }" :options="layoutOptions" />
      <Select v-model="align" size="small" :style="{ width: '116px' }" :options="alignOptions" />
      <Switch v-model="disabled" size="small" />
      <Button size="small" type="primary" @click="validate">校验</Button>
      <Button size="small" @click="clear">清空</Button>
    </Space>
    <AbForm
      ref="formRef"
      v-model:model="model"
      controlled
      :schemas="basicSchemas"
      :disabled="disabled"
      :disabled-styles="basicDisabledStyles"
      :layout="layout"
      :label-align="align"
      label-col-flex="112px"
      :schema-props="basicSchemaProps"
      @change="handleChange"
    />
    <div class="docs-demo-state">
      <pre>{{ JSON.stringify(model, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Message, Select, Space, Switch } from '@arco-design/web-vue'
import { AbForm, type FormInstance } from '@/components/Form'
import {
  alignOptions,
  basicDisabledStyles,
  basicSchemaProps,
  basicSchemas,
  layoutOptions,
  type FormLabelAlign,
  type FormLayout
} from './shared'

const formRef = ref<FormInstance>()
const layout = ref<FormLayout>('horizontal')
const align = ref<FormLabelAlign>('right')
const disabled = ref(false)
const model = ref<Recordable>({
  name: '客户成功工作台',
  autoComplete: 'Acro Business',
  quantity: 12,
  keywords: ['high', 'reuse'],
  mention: '@产品经理',
  description: '通过一份 schema 覆盖常见业务输入控件。',
  department: 'rd',
  roles: ['pm'],
  level: 'important',
  city: ['hq', 'east', 'shanghai'],
  treeNode: 'shanghai',
  transfer: ['permission', 'dashboard'],
  date: '2026-06-02',
  dateRange: ['2026-06-01', '2026-06-30'],
  time: '09:30:00',
  themeColor: '#165dff',
  score: 4,
  progress: 68,
  enabled: true,
  comboCode: 'AB-2026-001',
  verification: '',
  attachments: [{ name: '需求清单.xlsx', url: 'https://example.com/requirements.xlsx' }],
  items: [
    { id: 1, name: '需求确认', owner: '张三', status: 'done' },
    { id: 2, name: '联调排期', owner: '李四', status: 'doing' }
  ]
})

async function validate() {
  const valid = await formRef.value?.validate()
  Message[valid ? 'success' : 'error'](valid ? '校验通过' : '请检查表单输入')
}

function clear() {
  model.value = {}
}

function handleChange(data: { field: string }) {
  Message.info(`字段 ${data.field} 已变化`)
}
</script>
