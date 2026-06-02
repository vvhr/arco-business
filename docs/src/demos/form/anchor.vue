<template>
  <div ref="scrollRef" class="anchor-frame">
    <AbForm
      v-model:model="model"
      controlled
      anchor
      :scroll-ref="scrollRef"
      :schemas="containerSchemas"
      :anchor-props="{ smooth: true, changeHash: false, boundary: 12 }"
      :anchor-affix-style="{ position: 'absolute', left: '12px', top: '12px' }"
      :schema-props="{ layoutProps: { span: 12 }, componentProps: { allowClear: true } }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbForm, type FormSchema } from '@/components/Form'

const scrollRef = ref<HTMLElement | null>(null)
const model = ref<Recordable>({
  projectName: '智慧供应链协同平台',
  department: 'delivery',
  city: ['hq', 'south', 'shenzhen'],
  remark: '容器内锚点滚动示例'
})

const departmentOptions = [
  { label: '研发中心', value: 'rd' },
  { label: '交付中心', value: 'delivery' },
  { label: '客户成功', value: 'success' }
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

const containerSchemas: FormSchema[] = [
  {
    type: 'Container',
    key: 'base',
    component: 'Group',
    label: '基础信息',
    children: [
      {
        field: 'projectName',
        label: '项目名称',
        component: 'Input',
        formItemProps: { rules: [{ required: true, message: '请输入项目名称' }] }
      },
      { field: 'department', label: '负责部门', component: 'Select', componentProps: { options: departmentOptions } }
    ],
    layoutProps: { span: 24 }
  },
  {
    type: 'Container',
    key: 'delivery',
    component: 'Group',
    label: '交付信息',
    children: [
      { field: 'city', label: '交付城市', component: 'Cascader', componentProps: { options: treeOptions } },
      { field: 'remark', label: '备注', component: 'Textarea', componentProps: { autoSize: true } }
    ],
    layoutProps: { span: 24 }
  }
]
</script>

<style scoped>
.anchor-frame {
  position: relative;
  height: 360px;
  overflow: auto;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  padding: 18px 18px 18px 138px;
}
</style>
