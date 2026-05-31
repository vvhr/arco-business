<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Button,
  Message,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Input,
  Modal
} from '@arco-design/web-vue'
import { AbModal } from '@/index'

const basicDialogVisible = ref(false)
const draggableDialogVisible = ref(false)
const fullscreenDialogVisible = ref(false)
const beforeCloseDialogVisible = ref(false)
const tabsDialogVisible = ref(false)
const customActionsDialogVisible = ref(false)
const noHeaderDialogVisible = ref(false)
const activeTab = ref('first')
const formModel = ref({})

function handleClose() {
  Message.info('关闭消息')
}

// 关闭前确认
const handleBeforeClose = (done: () => void) => {
  Modal.confirm({
    title: '提示',
    content: '确定要关闭对话框吗？',
    okText: '确定',
    cancelText: '取消',
    modalClass: 'ab-modal-simple',
    onOk: () => {
      done()
    }
  })
}

// 自定义操作按钮
const handleRefresh = () => {
  Message.info('刷新数据')
}

const handleDownload = () => {
  Message.info('下载数据')
}

const handlePrint = () => {
  Message.info('打印数据')
}
</script>

<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>高级对话框</h2>
    </div>
    <Card>
      <template #header>
        <div class="card-header">
          <span>使用示例</span>
        </div>
      </template>
      <div class="flex flex-wrap flex-row gap-2">
        <Button type="primary" @click="basicDialogVisible = true">基础对话框</Button>
        <Button type="outline" @click="draggableDialogVisible = true">可拖拽对话框</Button>
        <Button type="primary" @click="fullscreenDialogVisible = true">全屏切换对话框</Button>
        <Button type="outline" @click="beforeCloseDialogVisible = true">关闭前确认对话框</Button>
        <Button type="primary" @click="tabsDialogVisible = true">标签页对话框</Button>
        <Button type="outline" @click="customActionsDialogVisible = true">自定义操作按钮</Button>
        <Button type="primary" @click="noHeaderDialogVisible = true">无标题对话框</Button>
      </div>
    </Card>

    <AbModal
      v-model="basicDialogVisible"
      title="基础对话框"
      width="500px"
      :show-fullscreen="true"
      @close="handleClose"
    >
      <div style="background-color: aqua; min-height: 300px; height: 100%; width: 100%"></div>
      <template #footer>
        <Button @click="basicDialogVisible = false">关闭</Button>
      </template>
    </AbModal>
    <AbModal v-model="draggableDialogVisible" title="可拖拽对话框" width="600px" :draggable="true">
      <div style="background-color: aqua; height: 300px; width: 100%"></div>
      <template #footer>
        <Button @click="draggableDialogVisible = false">关闭</Button>
      </template>
    </AbModal>
    <AbModal
      v-model="fullscreenDialogVisible"
      title="全屏对话框"
      :show-fullscreen="true"
      :scrollable="true"
    >
      <div style="padding: 10px; background: var(--color-fill-1)">
        <div v-for="i in 50" :key="i">这是第 {{ i }} 行内容，全屏模式下可以显示更多内容</div>
      </div>
      <template #footer>
        <Button @click="fullscreenDialogVisible = false">关闭</Button>
      </template>
    </AbModal>
    <AbModal
      v-model="beforeCloseDialogVisible"
      title="关闭前确认"
      width="500px"
      :mask-closable="false"
      :before-close="handleBeforeClose"
    >
      <div>
        <p>尝试关闭这个对话框，会弹出确认提示。</p>
        <p>这对于防止用户误操作非常有用。</p>
        <div style="margin-top: 20px; padding: 20px; background: var(--color-fill-1)">
          <h4>使用场景：</h4>
          <ul>
            <li>表单有未保存的修改</li>
            <li>重要操作需要二次确认</li>
            <li>防止误关闭导致数据丢失</li>
          </ul>
        </div>
      </div>
    </AbModal>

    <!-- 标签页对话框 -->
    <AbModal v-model="tabsDialogVisible" title="标签页对话框" width="700px" :scrollable="false">
      <Tabs
        v-model:active-key="activeTab"
        style="height: 500px; display: flex; flex-direction: column"
        type="card"
      >
        <TabPane title="用户管理" key="first">
          <div style="padding: 16px">
            <div v-for="i in 10" :key="i">用户数据 {{ i }}</div>
          </div>
        </TabPane>
        <TabPane title="配置管理" key="second">
          <div style="padding: 16px">
            <Form layout="vertical" :model="formModel">
              <FormItem label="系统名称">
                <Input placeholder="请输入系统名称" />
              </FormItem>
              <FormItem label="系统版本">
                <Input placeholder="请输入系统版本" />
              </FormItem>
            </Form>
          </div>
        </TabPane>
        <TabPane title="权限管理" key="third">
          <div style="padding: 16px">
            <h4>权限管理</h4>
            <p>这是权限管理的内容区域。</p>
          </div>
        </TabPane>
      </Tabs>
      <template #footer>
        <Button @click="tabsDialogVisible = false">关闭</Button>
      </template>
    </AbModal>

    <!-- 自定义操作按钮对话框 -->
    <AbModal
      v-model="customActionsDialogVisible"
      title="数据详情"
      width="600px"
      :show-fullscreen="true"
    >
      <template #header-actions>
        <div class="ab-modal-btn" @click="handleRefresh">
          <icon-refresh :size="16" />
        </div>
        <div class="ab-modal-btn" @click="handleDownload">
          <icon-download :size="16" />
        </div>
        <div class="ab-modal-btn" @click="handlePrint">
          <icon-printer :size="16" />
        </div>
      </template>
      <div>
        <p>📌 标题栏添加了自定义操作按钮：刷新、下载、打印</p>
        <p>
          通过
          <code>#header-actions</code>
          插槽可以在标题栏添加自定义操作按钮。
        </p>
        <div style="margin-top: 20px; padding: 20px; background: var(--color-fill-1)">
          <h4>使用场景：</h4>
          <ul>
            <li>数据刷新按钮</li>
            <li>导出/下载按钮</li>
            <li>打印按钮</li>
            <li>帮助/设置按钮</li>
            <li>其他快捷操作</li>
          </ul>
        </div>
        <div style="margin-top: 20px; padding: 20px; background: var(--color-fill-1)">
          <h4>💡 提示：</h4>
          <p>自定义按钮会自动继承统一的样式和 hover 效果。</p>
        </div>
      </div>
      <template #footer>
        <Button @click="customActionsDialogVisible = false">关闭</Button>
      </template>
    </AbModal>
    <AbModal v-model="noHeaderDialogVisible" width="600px" :hide-title="true">
      <div>
        <p>📌 无标题栏对话框</p>
        <p>
          通过
          <code>hide-title</code>
          属性可以关闭对话框的标题栏。
        </p>
        <p>
          通过
          <code>close-on-click-modal</code>
          属性可以点击模态框背景关闭对话框，但不会触发beforeClose事件。
        </p>
        <Button @click="noHeaderDialogVisible = false">关闭</Button>
      </div>
    </AbModal>
  </div>
</template>
