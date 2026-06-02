<template>
  <div class="docs-panel">
    <Space>
      <Button type="primary" @click="validateEditable">校验编辑表格</Button>
      <Button @click="toggleLoading">刷新操作列示例</Button>
    </Space>
    <AbTable
      ref="editableTableRef"
      v-model="editableRows"
      :columns="editableColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      editable
      :indexable="{ label: '序号', width: 76 }"
      :bordered="{ cell: true }"
      align="center"
      show-summary
    />
    <AbTable
      v-model="actionRows"
      :columns="actionColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      :loading="loading"
      bordered
      @action="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Message, Space } from '@arco-design/web-vue'
import { AbTable, type TableAction, type TableColumn, type TableInstance } from '@/components/Table'
import type { DictItem } from '@/types/dict'

const statusOptions: DictItem[] = [
  { label: '正常', value: 'active', type: 'success' },
  { label: '禁用', value: 'disabled', type: 'danger' },
  { label: '待审核', value: 'pending', type: 'warning' }
]

function createRows() {
  return [
    {
      id: 1,
      name: '张三',
      age: 28,
      email: 'zhangsan@example.com',
      phone: '13800138000',
      amount: 12345.67,
      status: 'active',
      createTime: '2024-01-15 10:30:00',
      remark: '支持展开行、复制、点击和合计。'
    },
    {
      id: 2,
      name: '李四',
      age: 32,
      email: 'lisi@example.com',
      phone: '13900139000',
      amount: 98765.43,
      status: 'disabled',
      createTime: '2024-02-20 14:20:00',
      remark: '该行通过 selectable 禁止选择。'
    },
    {
      id: 3,
      name: '王五',
      age: 25,
      email: 'wangwu@example.com',
      phone: '13700137000',
      amount: 54321,
      status: 'pending',
      createTime: '2024-03-10 09:15:00',
      remark: '拖动手柄可以调整行顺序。'
    }
  ]
}

const simpleColumns: TableColumn[] = [
  { field: 'name', label: '姓名', width: 130 },
  { field: 'age', label: '年龄', width: 100, align: 'center' },
  { field: 'email', label: '邮箱', minWidth: 220, ellipsis: true },
  {
    field: 'status',
    label: '状态',
    width: 120,
    type: 'dict',
    typeProps: { dictOptions: statusOptions, dictViewType: 'tag' }
  }
]

const actionItems: TableAction[] = [
  { label: '查看', name: 'view', icon: 'icon-park-outline:preview-open' },
  { label: '编辑', name: 'edit', type: 'primary', icon: 'icon-park-outline:edit', dropdown: 'always' },
  { label: '删除', name: 'delete', icon: 'icon-park-outline:delete', dropdown: 'always' },
  { label: '归档', name: 'archive', icon: 'icon-park-outline:folder-close', dropdown: 'always' }
]

const editableTableRef = ref<TableInstance>()
const loading = ref(false)
const actionRows = ref(createRows())
const editableRows = ref([
  { id: 1, name: '产品A', price: 100, quantity: 10, category: 'hardware' },
  { id: 2, name: '产品B', price: 200, quantity: 20, category: 'software' }
])

const editableColumns: TableColumn[] = [
  {
    field: 'name',
    label: '产品名称',
    editProps: {
      component: 'Input',
      formItemProps: { rules: [{ required: true, message: '请输入产品名称' }] }
    }
  },
  {
    field: 'price',
    label: '单价',
    summable: true,
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 0 },
      formItemProps: { rules: [{ required: true, message: '请输入单价' }] }
    }
  },
  {
    field: 'quantity',
    label: '数量',
    width: 120,
    summable: true,
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 0 },
      formItemProps: { rules: [{ required: true, message: '请输入数量' }] }
    }
  },
  {
    field: 'category',
    label: '分类',
    width: 120,
    editProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '硬件', value: 'hardware' },
          { label: '软件', value: 'software' }
        ]
      }
    }
  },
  {
    field: 'total',
    label: '总价',
    formatter: row => (Number(row.price || 0) * Number(row.quantity || 0)).toFixed(2)
  }
]

const actionColumns: TableColumn[] = [
  ...simpleColumns,
  {
    key: 'action',
    label: '操作',
    type: 'action',
    width: 240,
    fixed: 'right',
    typeProps: { actions: actionItems }
  }
]

async function validateEditable() {
  const valid = await editableTableRef.value?.validate()
  Message[valid ? 'success' : 'error'](valid ? '校验通过' : '请检查表格输入')
}

function toggleLoading() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    Message.success('刷新成功')
  }, 600)
}

function handleAction(event: { name: string; row: Recordable }) {
  Message.info(`${event.name}: ${event.row.name}`)
}
</script>
