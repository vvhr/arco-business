<template>
  <PageHeader
    eyebrow="Guide"
    title="快速开始"
    description="Acro Business 是基于 Vue 3 和 Arco Design Vue 的业务组件库。文档站独立承载安装、使用、示例和 API，组件库源码只保留可发布的组件能力。"
    :tags="['Install', 'Register', 'Develop']"
  />

  <SectionBlock id="quick-install" kicker="Install" title="安装依赖" description="业务项目需要同时安装组件库和 Arco Design Vue，Vue 由宿主项目提供。">
    <div class="docs-callout">
      <pre class="docs-code-inline">pnpm add arco-business @arco-design/web-vue</pre>
    </div>
  </SectionBlock>

  <SectionBlock id="quick-register" kicker="Register" title="全量注册" description="全量注册适合内部管理系统和组件库验证环境，按需引用适合更严格的包体积控制。">
    <div class="docs-callout">
      <pre class="docs-code-inline">import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import AcroBusiness from 'arco-business'
import 'arco-business/style.css'

createApp(App).use(ArcoVue).use(AcroBusiness).mount('#app')</pre>
    </div>
  </SectionBlock>

  <SectionBlock id="quick-docs" kicker="Documentation" title="本地文档站" description="文档站是独立 Vite 应用，负责组件示例、源码预览和 API 页面。">
    <FeatureGrid :items="features" />
    <div class="docs-callout">
      <pre class="docs-code-inline">pnpm dev
pnpm docs:build
pnpm build</pre>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import FeatureGrid from '@docs/components/FeatureGrid.vue'

const features = [
  { title: 'pnpm dev', description: '启动 docs 目录下的独立文档站。' },
  { title: 'pnpm docs:build', description: '构建可部署的 dist-docs 产物。' },
  { title: 'pnpm build', description: '构建组件库本身，不包含文档站页面。' }
]
</script>
