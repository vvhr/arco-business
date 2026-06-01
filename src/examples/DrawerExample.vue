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
import { AbDrawer } from '@/index'

const basicDrawerVisible = ref(false)
const directionDrawerVisible = ref(false)
const drawerDirection = ref<'right' | 'left' | 'top' | 'bottom'>('right')
const sizeDrawerVisible = ref(false)
const beforeCloseDrawerVisible = ref(false)
const tabsDrawerVisible = ref(false)
const customActionsDrawerVisible = ref(false)
const activeTab = ref('first')
const formModel = ref({})

// 处理基础抽屉确认
const handleBasicConfirm = () => {
  Message.info('确认操作')
}

// 打开指定方向的抽屉
const openDirectionDrawer = (direction: 'right' | 'left' | 'top' | 'bottom') => {
  drawerDirection.value = direction
  directionDrawerVisible.value = true
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
      <h2>高级抽屉</h2>
    </div>
    <Card>
      <template #header>
        <div class="card-header">
          <span>使用示例</span>
        </div>
      </template>
      <div class="flex flex-row gap-2 flex-wrap">
        <Button type="primary" @click="basicDrawerVisible = true">基础抽屉</Button>
        <Button type="outline" @click="openDirectionDrawer('right')">从右侧打开</Button>
        <Button type="primary" @click="openDirectionDrawer('left')">从左侧打开</Button>
        <Button type="outline" @click="openDirectionDrawer('top')">从顶部打开</Button>
        <Button type="primary" @click="openDirectionDrawer('bottom')">从底部打开</Button>
        <Button type="outline" @click="sizeDrawerVisible = true">自定义尺寸</Button>
        <Button type="primary" @click="beforeCloseDrawerVisible = true">关闭前确认抽屉</Button>
        <Button type="outline" @click="tabsDrawerVisible = true">标签页抽屉</Button>
        <Button type="primary" @click="customActionsDrawerVisible = true">自定义操作按钮</Button>
      </div>
    </Card>

    <!-- 基础抽屉 -->
    <AbDrawer v-model="basicDrawerVisible" title="基础抽屉">
      <div style="background-color: aqua; min-height: 300px; height: 100%; width: 100%"></div>
      <template #footer>
        <Button @click="basicDrawerVisible = false">取消</Button>
        <Button type="primary" @click="handleBasicConfirm">确认</Button>
      </template>
    </AbDrawer>

    <!-- 方向抽屉 -->
    <AbDrawer v-model="directionDrawerVisible" title="方向抽屉" :placement="drawerDirection" scrollable>
      <div>
        <p>📍 当前打开方向：{{ drawerDirection }}</p>
        <p>抽屉支持四个方向打开：</p>
        <ul>
          <li>
            <code>right</code>
            - 从右到左（默认）
          </li>
          <li>
            <code>left</code>
            - 从左到右
          </li>
          <li>
            <code>top</code>
            - 从上到下
          </li>
          <li>
            <code>bottom</code>
            - 从下到上
          </li>
        </ul>
        <div style="margin-top: 20px; padding: 20px; background: var(--fill-color-1)">
          <h4>使用场景：</h4>
          <ul>
            <li>侧边栏导航（right/left）</li>
            <li>通知面板（top）</li>
            <li>底部操作面板（bottom）</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <Button @click="directionDrawerVisible = false">关闭</Button>
      </template>
    </AbDrawer>

    <!-- 自定义尺寸抽屉 -->
    <AbDrawer v-model="sizeDrawerVisible" title="自定义尺寸" width="70%" scrollable>
      <div class="p-4" style="box-sizing: border-box">
        <p>📏 当前抽屉宽度：70%</p>
        <p>
          可以通过
          <code>width</code>
          属性自定义抽屉宽度：
        </p>
        <ul>
          <li>
            百分比：
            <code>30%</code>
            、
            <code>50%</code>
            、
            <code>80%</code>
          </li>
          <li>
            像素值：
            <code>400px</code>
            、
            <code>600px</code>
          </li>
        </ul>
        <div>
          <h4>内容区域滚动测试：</h4>
          <div style="background: var(--el-fill-color-light)">
            <p v-for="i in 30" :key="i">这是第 {{ i }} 行内容，用于测试滚动效果</p>
          </div>
        </div>
      </div>
      <template #footer>
        <Button @click="sizeDrawerVisible = false">关闭</Button>
      </template>
    </AbDrawer>

    <!-- 关闭前确认抽屉 -->
    <AbDrawer v-model="beforeCloseDrawerVisible" title="关闭前确认" :before-close="handleBeforeClose">
      <div>
        <p>尝试关闭这个抽屉，会弹出确认提示。</p>
        <p>这对于防止用户误操作非常有用。</p>
        <div style="margin-top: 20px; padding: 20px; background: var(--fill-color-1)">
          <h4>使用场景：</h4>
          <ul>
            <li>表单有未保存的修改</li>
            <li>重要操作需要二次确认</li>
            <li>防止误关闭导致数据丢失</li>
            <li>编辑器内容未保存</li>
          </ul>
        </div>
        <div style="margin-top: 20px; padding: 20px; background: var(--fill-color-1)">
          <h4>💡 提示：</h4>
          <p>可以通过点击关闭按钮、按 ESC 键或点击遮罩层来触发关闭前确认。</p>
        </div>
      </div>
    </AbDrawer>

    <!-- 标签页抽屉 -->
    <AbDrawer v-model="tabsDrawerVisible" title="标签页抽屉" width="50%" :scrollable="false">
      <Tabs
        v-model:active-key="activeTab"
        justify
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
        <Button @click="tabsDrawerVisible = false">取消</Button>
        <Button type="primary">保存</Button>
      </template>
    </AbDrawer>

    <!-- 自定义操作按钮抽屉 -->
    <AbDrawer v-model="customActionsDrawerVisible" title="设置中心" width="40%">
      <template #header-actions>
        <div class="ab-drawer-btn" @click="handleRefresh">
          <icon-refresh :size="16" />
        </div>
        <div class="ab-drawer-btn" @click="handleDownload">
          <icon-download :size="16" />
        </div>
        <div class="ab-drawer-btn" @click="handlePrint">
          <icon-printer :size="16" />
        </div>
      </template>
      <div>
        <p>📌 标题栏添加了自定义操作按钮：刷新、帮助、设置</p>
        <p>
          通过
          <code>#header-actions</code>
          插槽可以在标题栏添加自定义操作按钮。
        </p>
        <div style="margin-top: 20px; padding: 20px; background: var(--fill-color-1)">
          <h4>使用场景：</h4>
          <ul>
            <li>刷新按钮 - 重新加载数据</li>
            <li>帮助按钮 - 打开帮助文档</li>
            <li>设置按钮 - 快速访问设置</li>
            <li>搜索按钮 - 快速搜索功能</li>
            <li>筛选按钮 - 数据筛选</li>
          </ul>
        </div>
        <div style="margin-top: 20px; padding: 20px; background: var(--fill-color-1)">
          <h4>💡 提示：</h4>
          <p>自定义按钮会自动继承统一的样式和 hover 效果，保持视觉一致性。</p>
          <p>按钮会显示在关闭按钮之前，从左到右排列。</p>
        </div>
      </div>
      <template #footer>
        <Button @click="customActionsDrawerVisible = false">关闭</Button>
      </template>
    </AbDrawer>
  </div>
</template>
