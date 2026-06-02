<template>
  <div class="docs-panel">
    <Space>
      <Button type="primary" @click="basicVisible = true">基础对话框</Button>
      <Button @click="fullscreenVisible = true">全屏切换</Button>
    </Space>
    <AbModal v-model="basicVisible" title="基础对话框" width="520px" show-fullscreen>
      <div class="modal-demo-panel">对话框内容区域，可放置表单、表格或业务说明。</div>
      <template #footer>
        <Button type="primary" @click="basicVisible = false">确认</Button>
      </template>
    </AbModal>
    <AbModal v-model="fullscreenVisible" title="可滚动对话框" scrollable show-fullscreen>
      <div class="modal-demo-panel">
        <p v-for="item in 30" :key="item">这是第 {{ item }} 行内容。</p>
      </div>
    </AbModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Space } from '@arco-design/web-vue'
import { AbModal } from '@/components/Modal'

const basicVisible = ref(false)
const fullscreenVisible = ref(false)
</script>

<style scoped>
.modal-demo-panel {
  min-height: 180px;
  padding: 16px;
  background: var(--color-fill-1);
}
</style>
