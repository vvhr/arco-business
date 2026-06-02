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
import { AbTable } from '@/components/Table'
import { createRows, simpleColumns, type TableColumn } from './shared'

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
