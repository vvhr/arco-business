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
import { AbTable } from '@/components/Table'
import {
  checkboxSelection,
  createRows,
  simpleColumns,
  type TableInstance
} from './shared'

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
