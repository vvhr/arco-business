<template>
  <div class="docs-panel">
    <Space wrap>
      <Button type="primary" @click="detailVisible = true">自适应滚动详情</Button>
      <Button @click="guardVisible = true">关闭拦截抽屉</Button>
    </Space>

    <AbDrawer
      v-model="detailVisible"
      title="客户详情"
      width="460px"
      scrollable
      :before-close="beforeClose"
    >
      <template #header-actions>
        <Button size="mini" @click="Message.info('模拟刷新详情')">刷新</Button>
      </template>
      <div class="drawer-demo-panel">
        <p v-for="item in 26" :key="item">详情字段 {{ item }}：内容区高度由内置滚动条自适应。</p>
      </div>
      <template #footer>
        <Space>
          <Button @click="detailVisible = false">关闭</Button>
          <Button type="primary">保存草稿</Button>
        </Space>
      </template>
    </AbDrawer>

    <AbDrawer
      v-model="guardVisible"
      title="关闭前确认"
      placement="right"
      width="420px"
      :before-close="beforeClose"
    >
      <div class="drawer-demo-panel">
        点击右上角关闭时会先执行 beforeClose，适合保存草稿、二次确认或调用接口释放锁。
      </div>
    </AbDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Message, Space } from '@arco-design/web-vue'
import { AbDrawer } from '@/components/Drawer'

const detailVisible = ref(false)
const guardVisible = ref(false)

function beforeClose(done: () => void) {
  Message.info('模拟关闭拦截，600ms 后关闭')
  window.setTimeout(done, 600)
}
</script>

<style scoped>
.drawer-demo-panel {
  padding: 16px;
  border-radius: 8px;
  background: var(--color-fill-1);
  line-height: 1.8;
}
</style>
