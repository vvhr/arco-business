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
import {
  AbForm,
  type FormDisabledStyles,
  type FormInstance,
  type FormLabelAlign,
  type FormLayout,
  type FormSchema,
  type FormSchemaProps
} from '@/components/Form'
import type { TableColumn } from '@/components/Table'

const layoutOptions = [
  { label: 'horizontal', value: 'horizontal' },
  { label: 'vertical', value: 'vertical' },
  { label: 'inline', value: 'inline' }
]

const alignOptions = [
  { label: 'right', value: 'right' },
  { label: 'left', value: 'left' }
]

const departmentOptions = [
  { label: '研发中心', value: 'rd' },
  { label: '交付中心', value: 'delivery' },
  { label: '客户成功', value: 'success' }
]

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '项目经理', value: 'pm' },
  { label: '开发工程师', value: 'dev' }
]

const transferOptions = [
  { label: '权限配置', value: 'permission' },
  { label: '流程审批', value: 'workflow' },
  { label: '数据看板', value: 'dashboard' },
  { label: '消息通知', value: 'notice' }
]

const treeOptions = [
  {
    label: '总部',
    value: 'hq',
    children: [
      {
        label: '华东区',
        value: 'east',
        children: [
          { label: '上海', value: 'shanghai' },
          { label: '杭州', value: 'hangzhou' }
        ]
      },
      {
        label: '华南区',
        value: 'south',
        children: [{ label: '深圳', value: 'shenzhen' }]
      }
    ]
  }
]

const basicDisabledStyles: FormDisabledStyles = {
  noPadding: true,
  defaultCursor: true,
  noSuffix: true
}

const basicSchemaProps: FormSchemaProps = {
  layoutProps: { span: 12 },
  componentProps: { allowClear: true }
}

const tableColumns: TableColumn[] = [
  { field: 'name', label: '事项', width: 160 },
  { field: 'owner', label: '负责人', width: 120 },
  { field: 'status', label: '状态', width: 120 }
]

const basicSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '项目名称',
    component: 'Input',
    formItemProps: { rules: [{ required: true, message: '请输入项目名称' }] }
  },
  {
    field: 'autoComplete',
    label: '自动完成',
    component: 'AutoComplete',
    componentProps: { data: ['Acro Business', 'Arco Design', 'Vue Admin'] }
  },
  {
    field: 'quantity',
    label: '数量',
    component: 'InputNumber',
    componentProps: { min: 0, max: 100 }
  },
  {
    field: 'keywords',
    label: '标签输入',
    component: 'InputTag',
    componentProps: { placeholder: '输入后回车确认' }
  },
  {
    field: 'mention',
    label: '提及人员',
    component: 'Mention',
    componentProps: { options: ['@产品经理', '@交付经理', '@客户成功'] }
  },
  {
    field: 'description',
    label: '描述',
    component: 'Textarea',
    componentProps: { autoSize: { minRows: 2, maxRows: 4 } }
  },
  {
    field: 'department',
    label: '部门',
    component: 'Select',
    componentProps: { options: departmentOptions }
  },
  {
    field: 'roles',
    label: '多选角色',
    component: 'CheckboxGroup',
    componentProps: { options: roleOptions }
  },
  {
    field: 'level',
    label: '单选级别',
    component: 'RadioGroup',
    componentProps: {
      type: 'button',
      options: [
        { label: '普通', value: 'normal' },
        { label: '重要', value: 'important' },
        { label: '紧急', value: 'urgent' }
      ]
    }
  },
  {
    field: 'city',
    label: '城市',
    component: 'Cascader',
    componentProps: { options: treeOptions }
  },
  {
    field: 'treeNode',
    label: '组织节点',
    component: 'TreeSelect',
    componentProps: { options: treeOptions }
  },
  {
    field: 'transfer',
    label: '能力选择',
    component: 'Transfer',
    layoutProps: { span: 24 },
    componentProps: { options: transferOptions, simple: true }
  },
  {
    field: 'date',
    label: '日期',
    component: 'DatePicker'
  },
  {
    field: 'dateRange',
    label: '日期范围',
    component: 'RangePicker'
  },
  {
    field: 'time',
    label: '时间',
    component: 'TimePicker'
  },
  {
    field: 'themeColor',
    label: '主题色',
    component: 'ColorPicker'
  },
  {
    field: 'score',
    label: '评分',
    component: 'Rate'
  },
  {
    field: 'progress',
    label: '进度',
    component: 'Slider',
    componentProps: { min: 0, max: 100 }
  },
  {
    field: 'enabled',
    label: '启用',
    component: 'Switch'
  },
  {
    field: 'comboCode',
    label: '组合编号',
    component: 'ComboInput',
    componentProps: { template: 'AB-{year}-{no}' }
  },
  {
    field: 'verification',
    label: '验证码',
    component: 'VerificationCode'
  },
  {
    field: 'attachments',
    label: '附件',
    component: 'Upload',
    layoutProps: { span: 24 },
    componentProps: {
      listType: 'text',
      downloadable: true,
      upload: async (file: File) => ({ name: file.name, url: URL.createObjectURL(file) })
    }
  },
  {
    field: 'items',
    label: '内嵌表格',
    component: 'Table',
    layoutProps: { span: 24 },
    componentProps: {
      columns: tableColumns,
      pagination: false,
      bordered: true,
      rowKey: 'id'
    }
  }
]

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
