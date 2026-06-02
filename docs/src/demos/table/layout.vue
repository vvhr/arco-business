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
import { AbTable } from '@/components/Table'
import { createHeightRows, simpleColumns } from './shared'

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
