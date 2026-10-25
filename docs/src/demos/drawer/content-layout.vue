<template>
  <Button @click="visible = true">正文独立滚动抽屉</Button>
  <AbDrawer
    v-model="visible"
    title="详情正文布局"
    :width="500"
    :scrollable="false"
    content-layout="flex"
    :content-style="{ padding: 0 }"
  >
    <div class="content-scroll">
      <p v-for="line in 50" :key="line">详情字段 {{ line }}：此区域独立滚动。</p>
    </div>
    <div class="content-actions"><Button @click="visible = false">完成</Button></div>
  </AbDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@arco-design/web-vue'
import { AbDrawer } from '@/components/Drawer'
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
