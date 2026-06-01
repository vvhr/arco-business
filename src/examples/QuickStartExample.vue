<template>
  <div class="demo-section">
    <el-card class="demo-card">
      <template #header>
        <span>📦 安装</span>
      </template>
      <pre class="code-block"><code>npm install acro-business
# 或
yarn add acro-business
# 或
pnpm add acro-business</code></pre>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>🔧 完整引入</span>
      </template>
      <pre class="code-block"><code>import { createApp } from 'vue'
import App from './App.vue'
/** 引入 Element Plus */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/** 引入 AdvancedEleUI 组件库 */
import AdvancedEleUI from 'acro-business'
import 'acro-business/dist/style.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(AdvancedEleUI)
app.mount('#app')</code></pre>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>🌍 国际化配置</span>
      </template>
      <div class="type-support-content">
        <p class="description">组件库支持中英文，默认为中文。可以全局设置语言：</p>
        <div class="method-title">设置为英文</div>
        <pre class="code-block"><code>app.use(AdvancedEleUI, {
  locale: 'en-US'
})</code></pre>
        <div class="method-title">运行时切换</div>
        <pre class="code-block"><code>import { setLocale } from 'acro-business'

// 切换到英文
setLocale('en-US')

// 切换到中文
setLocale('zh-CN')</code></pre>
        <p class="tip">💡 全局配置后，所有组件都会自动使用设置的语言，无需在每个组件中单独配置</p>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>📝 按需引入</span>
      </template>
      <pre
        class="code-block"
      ><code>import { AeForm, AeTable, AbIcon } from 'acro-business'
import 'acro-business/dist/style.css'</code></pre>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>🎯 TypeScript 全局组件类型支持</span>
      </template>
      <div class="type-support-content">
        <p class="description">完整引入后，为了让 IDE 识别全局注册的组件，需要配置类型声明：</p>
        <div class="method-title">方式一：在 tsconfig.json 中配置</div>
        <pre class="code-block"><code>{
  "compilerOptions": {
    "types": ["acro-business/global"]
  }
}</code></pre>
        <div class="method-title">方式二：在 env.d.ts 中引用</div>
        <pre
          class="code-block"
        ><code>/// &lt;reference types="acro-business/global" /&gt;</code></pre>
        <p class="tip">💡 配置后重启 IDE，即可在 Vue 文件中直接使用组件并获得完整的类型提示</p>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>💡 使用示例（完整引入）</span>
      </template>
      <pre class="code-block"><code>&lt;template&gt;
  &lt;!-- ✅ 全局注册后可直接使用，无需导入组件 --&gt;
  &lt;AeForm :model="formModel" :schemas="formSchemas" /&gt;
  &lt;AeTable :columns="columns" v-model="tableData" /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
// ✅ 只需导入类型定义
import type { FormSchema, TableColumn } from 'acro-business'

const formModel = ref&lt;Recordable&gt;({})

const formSchemas: FormSchema[] = [
  {
    type: 'Inputer',
    component: 'Input',
    field: 'username',
    label: '用户名'
  }
]

const columns: TableColumn[] = [
  { field: 'name', label: '姓名' }
]

const tableData = ref([
  { name: '张三' }
])
&lt;/script&gt;</code></pre>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>📦 使用示例（按需引入）</span>
      </template>
      <pre class="code-block"><code>&lt;template&gt;
  &lt;!-- ❌ 按需引入需要显式导入组件 --&gt;
  &lt;AeForm :model="formModel" :schemas="formSchemas" /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
// ✅ 按需引入时需要导入组件和类型
import { AeForm, type FormSchema } from 'acro-business'

const formModel = ref&lt;Recordable&gt;({})

const formSchemas: FormSchema[] = [
  {
    type: 'Inputer',
    component: 'Input',
    field: 'username',
    label: '用户名'
  }
]
&lt;/script&gt;</code></pre>
    </el-card>
  </div>
</template>

<style scoped>
.demo-section {
  padding: 20px;
}

.demo-card {
  margin-bottom: 20px;
}

.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0;
}

.code-block code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.type-support-content {
  padding: 10px 0;
}

.description {
  margin: 0 0 16px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.method-title {
  margin: 16px 0 8px 0;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.tip {
  margin: 16px 0 0 0;
  padding: 12px 16px;
  background: #ecf5ff;
  border-left: 4px solid #409eff;
  color: #409eff;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 4px;
}
</style>
