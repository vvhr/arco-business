<template>
  <div class="docs-panel">
    <Space wrap>
      <Button type="primary" @click="visible = true">打开高级对话框</Button>
      <Button @click="scrollVisible = true">滚动内容与关闭拦截</Button>
    </Space>

    <AbModal
      v-model="visible"
      title="自定义标题工具栏"
      width="680px"
      show-fullscreen
      draggable
      :before-close="beforeClose"
    >
      <template #header-actions>
        <Button size="mini" @click="Message.info('模拟刷新')">刷新</Button>
        <Button size="mini" @click="Message.info('模拟导出')">导出</Button>
      </template>
      <div class="modal-demo-panel">
        <p>AbModal 自建标题栏，因此可以稳定插入右上角工具按钮。</p>
        <p>默认不使用原生底部按钮，业务可以自行定义复杂操作区。</p>
      </div>
      <template #footer>
        <Space>
          <Button @click="visible = false">取消</Button>
          <Button type="primary" @click="Message.success('已提交')">提交并继续编辑</Button>
          <Button type="primary" status="success" @click="visible = false">提交并关闭</Button>
        </Space>
      </template>
    </AbModal>

    <AbModal
      v-model="scrollVisible"
      title="内置滚动区域"
      width="620px"
      scrollable
      show-fullscreen
      scrollbar-height="320px"
      :before-close="beforeClose"
    >
      <div class="modal-demo-panel">
        <p v-for="item in 24" :key="item">第 {{ item }} 行：长内容由 AbModal 内置 Scrollbar 接管。</p>
      </div>
    </AbModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Message, Space } from '@arco-design/web-vue'
import { AbModal } from '@/components/Modal'

const visible = ref(false)
const scrollVisible = ref(false)

function beforeClose(done: () => void) {
  Message.info('模拟关闭前保存，600ms 后关闭')
  window.setTimeout(done, 600)
}
</script>

<style scoped>
.modal-demo-panel {
  min-height: 160px;
  padding: 16px;
  background: var(--color-fill-1);
  line-height: 1.8;
}
</style>
