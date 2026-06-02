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
</style>
