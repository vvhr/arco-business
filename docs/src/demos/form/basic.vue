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
  name: '张三',
  department: 'rd',
  roles: ['pm'],
  city: ['hq', 'east', 'shanghai'],
  enabled: true
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
