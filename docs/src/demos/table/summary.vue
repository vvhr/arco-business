<template>
  <div class="docs-panel">
    <AbTable
      v-model="rows"
      :columns="summaryColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      show-summary
      bordered
    />
    <AbTable
      v-model="selectionRows"
      :columns="summaryColumns"
      :form="{}"
      :excontext="{}"
      :dict="{}"
      :selectable="checkboxSelection"
      show-summary
      bordered
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbTable } from '@/components/Table'
import { checkboxSelection, createRows, summaryColumns } from './shared'

const rows = ref(createRows())
const selectionRows = ref(createRows())
</script>
