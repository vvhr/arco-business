<template>
  <AbTable
    v-model="rows"
    v-model:page="page"
    v-model:page-size="pageSize"
    :columns="simpleColumns"
    :form="{}"
    :excontext="{}"
    :dict="{}"
    :indexable="{ label: '序号', width: 76, fixed: 'left' }"
    :pagination="{ total: rows.length, pageSizeOptions: [5, 10, 20] }"
    bordered
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbTable } from '@/components/Table'
import { createHeightRows, simpleColumns } from './shared'

const rows = ref(createHeightRows())
const page = ref(1)
const pageSize = ref(5)
</script>
