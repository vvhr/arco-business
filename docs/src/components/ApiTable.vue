<template>
  <section :id="id" class="docs-api-section" data-anchor :data-anchor-title="title">
    <h3>{{ title }}</h3>
    <p v-if="description" class="docs-api-section__description">{{ description }}</p>
    <Table :columns="columns" :data="rows" :pagination="false" size="small" />
  </section>
</template>

<script setup lang="ts">
import { Table } from '@arco-design/web-vue'
import type { TableColumnData } from '@arco-design/web-vue'
import type { ApiRow } from './types'

defineProps<{
  id: string
  title: string
  description?: string
  rows: ApiRow[]
}>()

const columns: TableColumnData[] = [
  { title: '名称', dataIndex: 'name', width: 180 },
  { title: '说明', dataIndex: 'description' },
  { title: '类型', dataIndex: 'type', width: 240 },
  { title: '默认值', dataIndex: 'defaultValue', width: 160 }
]
</script>
