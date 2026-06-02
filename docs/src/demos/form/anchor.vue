<template>
  <div ref="scrollRef" class="anchor-frame">
    <AbForm
      v-model:model="model"
      controlled
      anchor
      :scroll-ref="scrollRef"
      :schemas="containerSchemas"
      :anchor-props="{ smooth: true, changeHash: false, boundary: 12 }"
      :anchor-affix-style="{ position: 'absolute', left: '12px', top: '12px' }"
      :schema-props="{ layoutProps: { span: 12 }, componentProps: { allowClear: true } }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbForm } from '@/components/Form'
import { containerSchemas } from './shared'

const scrollRef = ref<HTMLElement | null>(null)
const model = ref<Recordable>({
  projectName: '智慧供应链协同平台',
  department: 'delivery',
  city: ['hq', 'south', 'shenzhen'],
  remark: '容器内锚点滚动示例'
})
</script>

<style scoped>
.anchor-frame {
  position: relative;
  height: 360px;
  overflow: auto;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  padding: 18px 18px 18px 138px;
}
</style>
