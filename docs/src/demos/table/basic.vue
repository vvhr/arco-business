<template>
  <AbTable
    v-model="rows"
    v-model:page="page"
    v-model:page-size="pageSize"
    :columns="formatColumns"
    :form="{}"
    :excontext="{}"
    :dict="{}"
    :indexable="{ label: '序号', width: 76, fixed: 'left' }"
    :pagination="{ total: rows.length, pageSizeOptions: [5, 10, 20] }"
    bordered
    show-summary
  />
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

function createFormatRows() {
  return [
    {
      id: 1,
      name: '张三',
      status: 'active',
      createTime: '2026-05-28 10:30:00',
      amount: 128560.45,
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    {
      id: 2,
      name: '李四',
      status: 'pending',
      createTime: '2026-05-30 14:20:00',
      amount: 20480,
      phone: '13900139000',
      email: 'lisi@example.com'
    },
    {
      id: 3,
      name: '王五',
      status: 'disabled',
      createTime: '2026-06-01 09:15:00',
      amount: 9876.3,
      phone: '13700137000',
      email: 'wangwu@example.com'
    }
  ]
}

const formatColumns: TableColumn[] = [
  { field: 'name', label: '客户', width: 120, fixed: 'left' },
  {
    field: 'status',
    label: '状态字典',
    width: 140,
    type: 'dict',
    typeProps: { dictOptions: statusOptions, dictViewType: 'dot-tag' }
  },
  {
    field: 'createTime',
    label: '创建时间',
    width: 180,
    type: 'date',
    typeProps: { dateFormat: 'YYYY-MM-DD HH:mm' }
  },
  {
    field: 'amount',
    label: '合同金额',
    width: 180,
    align: 'right',
    type: 'amount',
    summable: true,
    typeProps: { amountThousand: true, amountDigits: 2, amountUnit: '元' }
  },
  {
    field: 'phone',
    label: '手机号脱敏',
    width: 160,
    type: 'sensitive',
    typeProps: { sensitiveType: 'phone', sensitiveHover: true }
  },
  {
    field: 'email',
    label: '邮箱脱敏',
    minWidth: 220,
    type: 'sensitive',
    typeProps: { sensitiveType: 'email' }
  }
]

const rows = ref(createFormatRows())
const page = ref(1)
const pageSize = ref(5)
</script>
