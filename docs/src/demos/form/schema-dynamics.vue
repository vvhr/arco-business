<template>
  <div class="docs-panel">
    <Space wrap>
      <Button type="primary" @click="validateForm">校验表单</Button>
      <Button @click="resetForm">重置校验</Button>
      <Button @click="toggleReadonly">{{ readonly ? '切换编辑态' : '切换只读态' }}</Button>
    </Space>
    <AbForm
      ref="formRef"
      v-model:model="model"
      controlled
      :schemas="schemas"
      :excontext="pageContext"
      :disabled="readonly"
      :schema-props="schemaProps"
      :disabled-styles="disabledStyles"
      @change="handleChange"
    />
    <div class="docs-demo-state">
      <span>最近变更：{{ pageContext.lastChange || '暂无' }}</span>
      <span>当前模型：{{ model }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Button, Message, Space } from '@arco-design/web-vue'
import {
  AbForm,
  type FormDisabledStyles,
  type FormInstance,
  type FormSchema,
  type FormSchemaProps
} from '@/components/Form'

const formRef = ref<FormInstance>()
const readonly = ref(false)
const model = ref<Recordable>({
  department: 'rd',
  role: 'frontend',
  owner: '13800138000',
  email: 'business@example.com',
  level: 3,
  urgent: true
})

const pageContext = reactive({
  lastChange: '',
  rolesByDepartment: {
    rd: [
      { label: '前端负责人', value: 'frontend' },
      { label: '后端负责人', value: 'backend' }
    ],
    delivery: [
      { label: '项目经理', value: 'pm' },
      { label: '实施顾问', value: 'consultant' }
    ],
    success: [
      { label: '客户成功', value: 'success' },
      { label: '售后支持', value: 'support' }
    ]
  }
})

const schemaProps: FormSchemaProps = {
  layoutProps: { span: 12 },
  componentProps: { allowClear: true }
}

const disabledStyles: FormDisabledStyles = {
  bgColor: false,
  noPadding: true,
  defaultCursor: true,
  noSuffix: true
}

const schemas: FormSchema[] = [
  {
    field: 'department',
    label: '业务部门',
    component: 'Select',
    componentProps: {
      options: [
        { label: '研发中心', value: 'rd' },
        { label: '交付中心', value: 'delivery' },
        { label: '客户成功', value: 'success' }
      ]
    },
    componentEvent: {
      onChange: (_value, form, _schema, _disabled, excontext) => {
        form.role = undefined
        excontext.lastChange = '部门变更后重置角色'
      }
    },
    formItemProps: { autoRules: ['isRequired'] }
  },
  {
    field: 'role',
    label: '角色',
    component: 'Select',
    componentProps: {
      _v_options: (form, _schema, _disabled, excontext) =>
        excontext.rolesByDepartment[form.department] || []
    },
    formItemProps: { autoRules: ['isRequired'] }
  },
  {
    field: 'owner',
    label: '负责人手机',
    component: 'Input',
    formItemProps: { autoRules: ['isRequired', 'isMobilePhone'] },
    componentProps: { maxLength: 11 }
  },
  {
    field: 'email',
    label: '通知邮箱',
    component: 'Input',
    formItemProps: { autoRules: ['isEmail'] },
    componentProps: {
      prepend: 'mail',
      vBinds: { disabled: 'urgent' }
    }
  },
  {
    field: 'level',
    label: '优先级',
    component: 'Slider',
    componentProps: { min: 1, max: 5, marks: { 1: '低', 3: '中', 5: '高' } }
  },
  {
    field: 'urgent',
    label: '紧急处理',
    component: 'Switch'
  },
  {
    field: 'reason',
    label: '紧急原因',
    component: 'Textarea',
    hidden: form => !form.urgent,
    formItemProps: { autoRules: ['isRequired'] },
    componentProps: { autoSize: true }
  }
]

async function validateForm() {
  const valid = await formRef.value?.validate()
  Message[valid ? 'success' : 'error'](valid ? '校验通过' : '请检查必填项和格式')
}

function resetForm() {
  formRef.value?.resetValidate()
}

function toggleReadonly() {
  readonly.value = !readonly.value
}

function handleChange(data: { field: string; value: any }) {
  pageContext.lastChange = `${data.field}: ${data.value ?? '-'}`
}
</script>
