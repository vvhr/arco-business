<template>
  <div class="docs-panel">
    <AbTable
      ref="tableRef"
      v-model="rows"
      :columns="simpleColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      :selectable="checkboxSelection"
      :indexable="true"
      bordered
      @selection-change="handleSelectionChange"
    />
    <Space>
      <Button type="primary" @click="setDefaultSelection">模拟默认多选</Button>
      <Button @click="clearSelection">清空外部选择</Button>
    </Space>
    <div class="docs-demo-state">
      <pre>{{ JSON.stringify(selectedRows, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Message, Space } from '@arco-design/web-vue'
import { AbTable, type TableColumn, type TableColumnSelect, type TableInstance } from '@/components/Table'
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

const checkboxSelection: TableColumnSelect = {
  label: '',
  width: 56,
  fixed: true,
  selectable: row => row.status !== 'disabled'
}

const tableRef = ref<TableInstance>()
const rows = ref(createRows())
const selectedRows = ref<Recordable[]>([])

function handleSelectionChange(rows: Recordable[]) {
  selectedRows.value = rows
  Message.info(`已选择 ${rows.length} 行`)
}

function setDefaultSelection() {
  tableRef.value?.updateSelectionKeys([1, 3])
}

function clearSelection() {
  tableRef.value?.updateSelectionKeys([])
}
</script>
