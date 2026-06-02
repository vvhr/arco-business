<template>
  <AbForm
    v-model:model="model"
    controlled
    :schemas="infoSchemas"
    layout="horizontal"
    label-align="right"
    label-col-flex="120px"
    :schema-props="{ layoutProps: { span: 12 }, componentProps: { allowClear: true } }"
  >
    <template #slotExtra--extra>
      <Tag color="green">extra 插槽：始终显示在控件下方</Tag>
    </template>
    <template #slotHelp--help>
      <span class="help-slot">help 插槽：会与校验提示共享位置</span>
    </template>
  </AbForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tag } from '@arco-design/web-vue'
import { AbForm } from '@/components/Form'
import { infoSchemas } from './shared'

const model = ref<Recordable>({
  title: '客户成功周报',
  slotExtra: '展示 extra 插槽',
  slotHelp: '展示 help 插槽'
})
</script>

<style scoped>
.help-slot {
  color: rgb(var(--warning-6));
}
</style>
