<template>
  <div class="docs-panel">
    <Space>
      <Button type="primary" @click="rightVisible = true">右侧抽屉</Button>
      <Button @click="bottomVisible = true">底部抽屉</Button>
    </Space>
    <AbDrawer v-model="rightVisible" title="右侧抽屉" placement="right" width="420px">
      <div class="drawer-demo-panel">适合承载详情、过滤条件或轻量编辑表单。</div>
    </AbDrawer>
    <AbDrawer v-model="bottomVisible" title="底部抽屉" placement="bottom" height="320px">
      <div class="drawer-demo-panel">底部抽屉适合展示跨页面的辅助信息。</div>
    </AbDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Space } from '@arco-design/web-vue'
import { AbDrawer } from '@/components/Drawer'

const rightVisible = ref(false)
const bottomVisible = ref(false)
</script>

<style scoped>
.drawer-demo-panel {
  padding: 16px;
  border-radius: 8px;
  background: var(--color-fill-1);
}
</style>
