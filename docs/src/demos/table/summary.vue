<template>
  <div class="docs-panel">
    <AbTable
      v-model="rows"
      :columns="summaryColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      show-summary
      bordered
    />
    <AbTable
      v-model="selectionRows"
      :columns="summaryColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      :selectable="checkboxSelection"
      show-summary
      bordered
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbTable, type TableColumn, type TableColumnSelect } from '@/components/Table'

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

const checkboxSelection: TableColumnSelect = {
  width: 56,
  fixed: true,
  selectable: row => row.status !== 'disabled'
}

const summaryColumns: TableColumn[] = [
  { field: 'name', label: '姓名', width: 130 },
  { field: 'age', label: '年龄', width: 100 },
  {
    field: 'amount',
    label: '金额',
    width: 180,
    type: 'amount',
    summable: true,
    typeProps: { amountThousand: true, amountDigits: 2, amountUnit: '元' }
  }
]

const rows = ref(createRows())
const selectionRows = ref(createRows())
</script>
