<template>
  <div class="docs-panel">
    <Space>
      <Switch v-model="disabled" size="small" />
      <Button size="small" type="primary" @click="validate">校验</Button>
      <Button size="small" @click="clear">清空</Button>
    </Space>
    <AbForm
      ref="formRef"
      v-model:model="model"
      controlled
      :disabled="disabled"
      :disabled-styles="editDisabledStyles"
      :imports="editImports"
      :schemas="editSchemas"
      layout="horizontal"
      label-align="right"
      label-col-flex="118px"
      :schema-props="{ layoutProps: { span: 24 }, componentProps: { allowClear: true } }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Message, Space, Switch } from '@arco-design/web-vue'
import { AbForm, type FormInstance } from '@/components/Form'
import { editDisabledStyles, editImports, editSchemas } from './shared'

const formRef = ref<FormInstance>()
const disabled = ref(false)
const model = ref<Recordable>({
  title: '迁移联调',
  status: true
})

async function validate() {
  const valid = await formRef.value?.validate()
  Message[valid ? 'success' : 'error'](valid ? '校验通过' : '请检查表单输入')
}

function clear() {
  model.value = {}
}
</script>
