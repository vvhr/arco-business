<template>
  <div class="docs-panel">
    <div class="fixed-height-frame">
      <AbTable
        v-model="rows"
        :columns="simpleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :indexable="true"
        adaptive
        bordered
      />
    </div>
    <Space>
      <span>自适应</span>
      <Switch v-model="adaptiveEnabled" />
    </Space>
    <div class="adaptive-height-frame">
      <AbTable
        v-model="rows"
        :columns="simpleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :adaptive="adaptiveEnabled"
        :pagination="{ total: rows.length, pageSizeOptions: [10, 20, 50] }"
        :indexable="true"
        bordered
      />
    </div>
    <div class="fixed-column-frame">
      <AbTable
        v-model="rows"
        :columns="fixedColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        adaptive
        :indexable="{ label: '序号', width: 76, fixed: 'left' }"
        bordered
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Space, Switch } from '@arco-design/web-vue'
import { AbTable, type TableColumn } from '@/components/Table'
import type { DictItem } from '@/types/dict'

const statusOptions: DictItem[] = [
  { label: '正常', value: 'active', type: 'success' },
  { label: '禁用', value: 'disabled', type: 'danger' },
  { label: '待审核', value: 'pending', type: 'warning' }
]

function createHeightRows() {
  return Array.from({ length: 18 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    age: 22 + (index % 12),
    email: `user${index + 1}@example.com`,
    phone: `1380013${String(8000 + index).slice(-4)}`,
    amount: 1000 + index * 125.5,
    status: statusOptions[index % statusOptions.length]?.value,
    createTime: '2024-05-01 12:00:00',
    remark: '用于验证滚动高度。'
  }))
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

const fixedColumns: TableColumn[] = [
  { field: 'name', label: '姓名', width: 140, fixed: 'left' },
  { field: 'age', label: '年龄', width: 100, align: 'center' },
  { field: 'email', label: '邮箱', width: 260, ellipsis: true },
  { field: 'phone', label: '手机号', width: 180 },
  { field: 'amount', label: '合同金额', width: 180, type: 'amount' },
  {
    field: 'status',
    label: '状态',
    width: 140,
    type: 'dict',
    typeProps: { dictOptions: statusOptions, dictViewType: 'tag' }
  },
  { field: 'createTime', label: '创建时间', width: 220 },
  { field: 'remark', label: '备注', width: 260, ellipsis: true },
  { key: 'operation', label: '操作', width: 160, fixed: 'right' }
]

const rows = ref(createHeightRows())
const adaptiveEnabled = ref(true)
</script>

<style scoped>
.fixed-height-frame {
  height: 320px;
  min-height: 0;
}

.adaptive-height-frame {
  height: 420px;
  min-height: 0;
}

.fixed-column-frame {
  width: 720px;
  height: 360px;
  min-height: 0;
}
</style>
