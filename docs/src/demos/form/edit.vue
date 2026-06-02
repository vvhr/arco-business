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
import { defineComponent, h, ref } from 'vue'
import { Button, Message, Space, Switch, Tag } from '@arco-design/web-vue'
import {
  AbForm,
  type FormDisabledStyles,
  type FormImportItem,
  type FormInstance,
  type FormSchema
} from '@/components/Form'
import { AbTable, type TableColumn } from '@/components/Table'

const editDisabledStyles: FormDisabledStyles = {
  bgColor: false,
  noPadding: true,
  defaultCursor: true,
  noSuffix: true
}

const tableColumns: TableColumn[] = [
  { field: 'name', label: '事项', width: 160 },
  { field: 'owner', label: '负责人', width: 120 },
  { field: 'status', label: '状态', width: 120 }
]

const tableData = [
  { id: 1, name: '需求确认', owner: '张三', status: 'done' },
  { id: 2, name: '联调排期', owner: '李四', status: 'doing' }
]

const tableField = defineComponent({
  name: 'DocsFormTableField',
  inheritAttrs: false,
  setup() {
    return () =>
      h(AbTable, {
        modelValue: tableData,
        columns: tableColumns,
        form: {},
        excontext: {},
        dict: {},
        bordered: true
      })
  }
})

const statusLabel = defineComponent({
  name: 'DocsStatusLabel',
  inheritAttrs: false,
  setup() {
    return () => h(Tag, { color: 'green' }, () => 'TSX/渲染函数组件')
  }
})

const editImports: FormImportItem[] = [
  { name: 'TableField', component: tableField },
  { name: 'StatusLabel', component: statusLabel }
]

const editSchemas: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    formItemProps: { rules: [{ required: true, message: '请输入标题' }] }
  },
  { field: 'status', label: '状态提示', component: 'StatusLabel' },
  {
    field: 'items',
    label: '嵌套表格',
    component: 'TableField',
    layoutProps: { span: 24 }
  }
]

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
