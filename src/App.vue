<template>
  <div ref="containerRef" class="demo-container" :class="{ dark: isDark }">
    <header class="demo-header">
      <a
        href="https://github.com/vvhr/acro-business"
        target="_blank"
        class="github-link"
        title="View on GitHub"
      >
        <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
      <a-switch
        v-model="isDark"
        unchecked-color="rgb(var(--warning-6))"
        class="theme-switch"
        @change="toggleTheme"
      >
        <template #checked-icon>
          <span style="color: rgb(var(--primary-6))">
            <icon-moon-fill />
          </span>
        </template>
        <template #unchecked-icon>
          <span style="color: rgb(var(--warning-6))">
            <icon-sun-fill />
          </span>
        </template>
      </a-switch>
      <div
        style="
          background-color: var(--color-bg-1);
          width: 220px;
          margin: 20px auto;
          border-radius: 12px;
        "
      >
        <img :src="Logo" title="logo" width="200px" alt="logo" />
      </div>
      <p class="subtitle">基于 Vue 3 + Arco Design Vue 的高级组件库</p>
    </header>
    <div style="background: var(--color-bg-1)">
      <Tabs v-model:active-key="activeTab" justify type="capsule">
        <TabPane title="🚀 快速开始" key="start">
          <QuickStartExample v-if="activeTab === 'start'" />
        </TabPane>
        <TabPane title="📝 AeForm 表单组件" key="form">
          <FormExample v-if="activeTab === 'form'" :container-ref="containerRef" />
        </TabPane>
        <TabPane title="📝 AbForm 表单组件" key="ab-form">
          <FormExample2 v-if="activeTab === 'ab-form'" />
        </TabPane>
        <TabPane title="📊 AbTable 表格组件" key="table">
          <TableExample v-if="activeTab === 'table'" />
        </TabPane>
        <TabPane title="🎨 AbIcon 图标组件" key="icon">
          <IconExample v-if="activeTab === 'icon'" />
        </TabPane>
        <TabPane title="📄 AbUpload 文件上传" key="upload">
          <UploadExample v-if="activeTab === 'upload'" />
        </TabPane>
        <TabPane title="💬 AbModal 对话框" key="modal">
          <ModalExample v-if="activeTab === 'modal'" />
        </TabPane>
        <TabPane title="💬 AbDrawer 抽屉" key="drawer">
          <DrawerExample v-if="activeTab === 'drawer'" />
        </TabPane>
        <TabPane title="💬 AbText 增强文本" key="text">
          <TextExample v-if="activeTab === 'text'" />
        </TabPane>
        <TabPane title="🧩 AbComboInput 组合输入器" key="combo-input">
          <ComboInputExample v-if="activeTab === 'combo-input'" />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/logo.png'
import { ref, onMounted } from 'vue'
import { Tabs, TabPane } from '@arco-design/web-vue'
import FormExample from './examples/FormExample.vue'
import FormExample2 from './examples/FormExample2.vue'
import TableExample from './examples/TableExample.vue'
import IconExample from './examples/IconExample.vue'
import UploadExample from './examples/UploadExample.vue'
import ModalExample from './examples/ModalExample.vue'
import DrawerExample from './examples/DrawerExample.vue'
import QuickStartExample from './examples/QuickStartExample.vue'
import TextExample from './examples/TextExample.vue'
import ComboInputExample from './examples/ComboInputExample.vue'

const activeTab = ref('start')
const isDark = ref(false)
const containerRef = ref()
// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    document.body.setAttribute('arco-theme', 'dark')
  }
})

// 切换主题
const toggleTheme = (value: boolean) => {
  if (value) {
    document.documentElement.classList.add('dark')
    document.body.setAttribute('arco-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.body.removeAttribute('arco-theme')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<style scoped>
.demo-container {
  height: 100vh;
  overflow: auto;
  background: linear-gradient(180deg, #0069fc 0%, #6faffe 100%);
  padding: 20px;
  box-sizing: border-box;
}

.demo-header {
  position: relative;
  text-align: center;
  color: white;
  margin-bottom: 30px;
  padding: 40px 20px;
}

.github-link {
  position: absolute;
  top: 20px;
  right: 80px;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.github-link:hover {
  transform: scale(1.1) rotate(360deg);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-switch {
  position: absolute;
  top: 32px;
  right: 20px;
}

.demo-header {
  > h1 {
    font-size: 48px;
    margin: 0 0 10px 0;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}
</style>

<style>
@import './examples/styles.css';
</style>
