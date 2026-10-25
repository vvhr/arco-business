<template>
  <Button @click="visible = true">正文独立滚动对话框</Button>
  <AbModal
    v-model="visible"
    title="正文布局"
    :scrollable="false"
    content-layout="flex"
    :content-style="{ padding: 0, height: '300px' }"
  >
    <div class="content-scroll">
      <p v-for="line in 30" :key="line">第 {{ line }} 行：此区域独立滚动。</p>
    </div>
    <div class="content-actions"><Button @click="visible = false">完成</Button></div>
  </AbModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@arco-design/web-vue'
import { AbModal } from '@/components/Modal'
const visible = ref(false)
</script>

<style scoped>
.content-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
}
.content-actions {
  flex-shrink: 0;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-2);
}
</style>
