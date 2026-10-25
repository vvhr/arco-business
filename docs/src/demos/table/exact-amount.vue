<template>
  <div class="docs-panel">
    <AbTable
      v-model="rows"
      :columns="columns"
      :amount-defaults="amountDefaults"
      show-summary
      :summary-method="summary"
      bordered
    />
    <p>最近点击金额：{{ lastClick || '尚未点击；零值金额不可点击' }}</p>
    <p>
      原始合计：{{
        sumAmounts(
          rows.map(row => row.amount),
          4
        )
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbTable, type TableColumn, type TableSummaryParams } from '@/components/Table'
import { sumAmounts } from '@/utils/decimal'
const lastClick = ref('')
const rows = ref([
  { id: 'one', name: '大金额', amount: '9007199254740993.1234', qty: '1.2000', unit: '件' },
  { id: 'two', name: '微小金额', amount: '0.0001', qty: '2.5000', unit: '件' },
  { id: 'zero', name: '零值', amount: '0.0000', qty: '0', unit: '件' }
])
const amountDefaults = {
  amountDigits: 4,
  amountThousand: true,
  amountZeroDisplay: '0',
  amountZeroClickable: false
}
const columns: TableColumn[] = [
  { field: 'name', label: '项目', width: 130 },
  {
    field: 'amount',
    label: '金额',
    type: 'amount',
    clickable: true,
    clickMethod: row => {
      lastClick.value = row.amount
    }
  },
  {
    field: 'qty',
    label: '数量',
    type: 'amount',
    typeProps: {
      amountDigits: 2,
      amountThousand: false,
      amountZero: false,
      amountUnitFormat: row => row.unit
    }
  },
  {
    field: 'custom',
    label: '自定义金额说明',
    type: 'amount',
    formatter: row => (row.id === 'zero' ? '无需处理' : '待确认')
  }
]
// 使用公开 rawData，不读取内部渲染记录，也不把金额字符串转成 number。
function summary({ rawData }: TableSummaryParams) {
  return [
    {
      name: '合计',
      amount: sumAmounts(
        rawData.map(row => row.amount),
        4
      )
    }
  ]
}
</script>
