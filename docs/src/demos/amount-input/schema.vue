<template>
  <div class="docs-panel">
    <AbForm v-model:model="model" :schemas="schemas" controlled />
    <p>表单金额：{{ JSON.stringify(model.amount) }}</p>
    <AbTable v-model="rows" :columns="columns" editable bordered />
    <p>表格金额：{{ JSON.stringify(rows[0].amount) }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbForm, type FormSchema } from '@/components/Form'
import { AbTable, type TableColumn } from '@/components/Table'

// AmountInput 是内置名称，无需通过 imports 重复注册。
const model = ref({ amount: '12.3400' })
const schemas: FormSchema[] = [
  {
    field: 'amount',
    label: '金额',
    component: 'AmountInput',
    componentProps: { precision: 4, showChineseUppercase: false }
  }
]
const rows = ref([{ id: 'one', amount: '12.3400' }])
const columns: TableColumn[] = [
  {
    field: 'amount',
    label: '编辑金额',
    type: 'amount',
    editable: true,
    editProps: {
      component: 'AmountInput',
      componentProps: { precision: 4, showChineseUppercase: false }
    }
  }
]
</script>
