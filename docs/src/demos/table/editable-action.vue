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
import { AbTable } from '@/components/Table'
import {
  actionItems,
  createRows,
  simpleColumns,
  type TableColumn,
  type TableInstance
} from './shared'

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
