<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download, Printer } from '@element-plus/icons-vue'
import { AbModal } from '@/index'

const basicDialogVisible = ref(false)
const draggableDialogVisible = ref(false)
const fullscreenDialogVisible = ref(false)
const beforeCloseDialogVisible = ref(false)
const tabsDialogVisible = ref(false)
const customActionsDialogVisible = ref(false)
const noHeaderDialogVisible = ref(false)
const activeTab = ref('first')
// 处理基础对话框确认

function handleClose() {
  ElMessage.success('关闭消息')
}

// 关闭前确认
const handleBeforeClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭对话框吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      done()
    })
    .catch(() => {
      // 取消关闭
    })
}

// 自定义操作按钮
const handleRefresh = () => {
  ElMessage.success('刷新数据')
}

const handleDownload = () => {
  ElMessage.success('下载数据')
}

const handlePrint = () => {
  ElMessage.success('打印数据')
}
</script>

<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>高级对话框</h2>
    </div>
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>使用示例</span>
        </div>
      </template>
      <el-button type="primary" @click="basicDialogVisible = true">基础对话框</el-button>
      <el-button type="primary" @click="draggableDialogVisible = true">可拖拽对话框</el-button>
      <el-button type="primary" @click="fullscreenDialogVisible = true">全屏切换对话框</el-button>
      <el-button type="primary" @click="beforeCloseDialogVisible = true">
        关闭前确认对话框
      </el-button>
      <el-button type="success" @click="tabsDialogVisible = true">标签页对话框</el-button>
      <el-button type="warning" @click="customActionsDialogVisible = true">
        自定义操作按钮
      </el-button>
      <el-button type="warning" @click="noHeaderDialogVisible = true">无标题对话框</el-button>
    </el-card>

    <AbModal
      v-model="basicDialogVisible"
      title="基础对话框"
      width="500px"
      :show-fullscreen="true"
      @close="handleClose"
    >
      <div style="background-color: aqua; min-height: 300px; height: 100%; width: 100%"></div>
      <template #footer>
        <el-button @click="basicDialogVisible = false">关闭</el-button>
      </template>
    </AbModal>
    <AbModal v-model="draggableDialogVisible" title="可拖拽对话框" width="600px" :draggable="true">
      <div style="background-color: aqua; height: 300px; width: 100%"></div>
      <template #footer>
        <el-button @click="draggableDialogVisible = false">关闭</el-button>
      </template>
    </AbModal>
    <AbModal
      v-model="fullscreenDialogVisible"
      title="全屏对话框"
      :show-fullscreen="true"
      :scrollable="true"
    >
      <div style="padding: 10px; background: var(--el-fill-color-light)">
        <div v-for="i in 50" :key="i">这是第 {{ i }} 行内容，全屏模式下可以显示更多内容</div>
      </div>
      <template #footer>
        <el-button @click="fullscreenDialogVisible = false">关闭</el-button>
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
        <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
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
      <el-tabs
        v-model="activeTab"
        style="height: 100%; display: flex; flex-direction: column"
        type="card"
      >
        <el-tab-pane label="用户管理" name="first">
          <div style="padding: 10px">
            <h4>用户管理</h4>
            <p>这是用户管理的内容区域。</p>
            <p>
              通过设置
              <code>:scrollable="false"</code>
              ，标签页可以自动撑开占满高度。
            </p>
            <div style="padding: 10px; background: var(--el-fill-color-light)">
              <p v-for="i in 10" :key="i">用户数据 {{ i }}</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
          <div style="padding: 10px">
            <h4>配置管理</h4>
            <p>这是配置管理的内容区域。</p>
            <el-form label-width="100px">
              <el-form-item label="系统名称">
                <el-input placeholder="请输入系统名称" />
              </el-form-item>
              <el-form-item label="系统版本">
                <el-input placeholder="请输入系统版本" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="权限管理" name="third">
          <div style="padding: 10px">
            <h4>权限管理</h4>
            <p>这是权限管理的内容区域。</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="tabsDialogVisible = false">关闭</el-button>
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
          <el-icon><Refresh /></el-icon>
        </div>
        <div class="ab-modal-btn" @click="handleDownload">
          <el-icon><Download /></el-icon>
        </div>
        <div class="ab-modal-btn" @click="handlePrint">
          <el-icon><Printer /></el-icon>
        </div>
      </template>
      <div>
        <p>📌 标题栏添加了自定义操作按钮：刷新、下载、打印</p>
        <p>
          通过
          <code>#header-actions</code>
          插槽可以在标题栏添加自定义操作按钮。
        </p>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
          <h4>使用场景：</h4>
          <ul>
            <li>数据刷新按钮</li>
            <li>导出/下载按钮</li>
            <li>打印按钮</li>
            <li>帮助/设置按钮</li>
            <li>其他快捷操作</li>
          </ul>
        </div>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-color-info-light-9)">
          <h4>💡 提示：</h4>
          <p>自定义按钮会自动继承统一的样式和 hover 效果。</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="customActionsDialogVisible = false">关闭</el-button>
      </template>
    </AbModal>
    <AbModal v-model="noHeaderDialogVisible" width="600px" :hide-title="true" :mask-closable="true">
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
        <el-button @click="noHeaderDialogVisible = false">关闭</el-button>
      </div>
    </AbModal>
  </div>
</template>
