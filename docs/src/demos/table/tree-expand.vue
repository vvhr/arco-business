<template>
  <div class="docs-panel">
    <AbTable
      v-model="treeRows"
      :columns="treeColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      row-key="id"
      bordered
    />
    <AbTable
      v-model="rows"
      :columns="simpleColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      :expandable="{ label: '', width: 48 }"
      bordered
    >
      <template #expand="{ row }">
        <div class="expand-panel">
          <strong>{{ row.name }}</strong>
          <span>{{ row.email }}</span>
          <span>{{ row.remark }}</span>
        </div>
      </template>
    </AbTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbTable, type TableColumn } from '@/components/Table'
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

const rows = ref(createRows())
const treeRows = ref([
  {
    id: 1,
    name: '总部',
    owner: '张三',
    amount: 120000,
    children: [
      { id: 11, name: '华东区', owner: '李四', amount: 56000 },
      { id: 12, name: '华南区', owner: '王五', amount: 64000 }
    ]
  },
  {
    id: 2,
    name: '研发中心',
    owner: '赵六',
    amount: 88000,
    children: [
      { id: 21, name: '平台组', owner: '钱七', amount: 43000 },
      { id: 22, name: '业务组', owner: '孙八', amount: 45000 }
    ]
  }
])

const treeColumns: TableColumn[] = [
  { field: 'name', label: '组织名称', minWidth: 180 },
  { field: 'owner', label: '负责人', width: 120 },
  {
    field: 'amount',
    label: '预算',
    width: 160,
    type: 'amount',
    typeProps: { amountThousand: true, amountUnit: '元' }
  }
]
</script>

<style scoped>
.expand-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 20px;
  color: var(--color-text-2);
  background: var(--color-fill-1);
}
</style>
