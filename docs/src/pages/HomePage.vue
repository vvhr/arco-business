<template>
  <div class="home-page">
    <header class="home-nav">
      <RouterLink class="home-brand" to="/">
        <BrandMark />
        <span>Acro Business</span>
      </RouterLink>
      <nav>
        <RouterLink to="/guide/quick-start">指南</RouterLink>
        <RouterLink to="/components/form">组件</RouterLink>
        <RouterLink to="/components/table">表格</RouterLink>
        <a href="https://github.com/vvhr/acro-business" target="_blank">GitHub</a>
        <Switch v-model="isDark" size="small" @change="toggleTheme">
          <template #checked-icon>
            <icon-moon-fill />
          </template>
          <template #unchecked-icon>
            <icon-sun-fill />
          </template>
        </Switch>
      </nav>
    </header>

    <main>
      <section class="home-hero">
        <div class="home-hero__content">
          <div class="home-hero__brand">
            <BrandMark size="lg" />
            <span>Vue 3 business components</span>
          </div>
          <h1>为 Arco Design Vue 打造的高级业务组件系统</h1>
          <p>
            将表单、表格、上传、弹窗和业务文本能力沉淀为可复用组件，并用独立文档站承载示例、API 与迁移说明。
          </p>
          <div class="home-hero__actions">
            <RouterLink class="home-button home-button--primary" to="/guide/quick-start">开始使用</RouterLink>
            <RouterLink class="home-button" to="/components/table">查看组件</RouterLink>
          </div>
        </div>

        <div class="home-product">
          <div class="home-product__bar">
            <span />
            <span />
            <span />
          </div>
          <div class="home-product__header">
            <BrandMark flat />
            <div>
              <strong>Documentation workspace</strong>
              <small>preview + source + api</small>
            </div>
          </div>
          <div class="home-product__grid">
            <article>
              <b>Schema Form</b>
              <span>layout, containers, anchors</span>
            </article>
            <article>
              <b>Business Table</b>
              <span>selection, edit, summary</span>
            </article>
            <article>
              <b>Preview Blocks</b>
              <span>runtime demo with raw source</span>
            </article>
            <article>
              <b>API Surface</b>
              <span>typed props and events</span>
            </article>
          </div>
          <pre>pnpm dev
pnpm docs:build
pnpm build</pre>
        </div>
      </section>

      <section class="home-band" data-anchor-title="Identity">
        <div>
          <p>Brand system</p>
          <h2>清晰、克制、面向开发者的组件品牌</h2>
        </div>
        <div class="home-identity">
          <div class="home-identity__tile">
            <BrandMark size="lg" />
            <span>主标识</span>
          </div>
          <div class="home-identity__tile home-identity__tile--accent">
            <span class="home-swatch" />
            <span>核心强调色</span>
          </div>
          <div class="home-identity__tile">
            <strong>AB</strong>
            <span>短标识</span>
          </div>
        </div>
      </section>

      <section class="home-capabilities">
        <article>
          <span>01</span>
          <h3>组件示例从源码迁出</h3>
          <p>组件库不再承担示例站职责，文档站独立运行、独立构建、独立部署。</p>
        </article>
        <article>
          <span>02</span>
          <h3>示例和源码同步</h3>
          <p>每个 DemoBlock 渲染真实 Vue 示例，并通过 raw import 展示同源代码。</p>
        </article>
        <article>
          <span>03</span>
          <h3>文档页带锚点导航</h3>
          <p>章节标题、说明、示例和 API 组成可扫描的二级文档结构。</p>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Switch } from '@arco-design/web-vue'
import BrandMark from '@docs/components/BrandMark.vue'

const isDark = ref(false)

function applyTheme(value: boolean) {
  if (value) {
    document.documentElement.classList.add('dark')
    document.body.setAttribute('arco-theme', 'dark')
    localStorage.setItem('docs-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.body.removeAttribute('arco-theme')
    localStorage.setItem('docs-theme', 'light')
  }
}

function toggleTheme(value: boolean | string | number) {
  applyTheme(Boolean(value))
}

onMounted(() => {
  isDark.value = localStorage.getItem('docs-theme') === 'dark'
  applyTheme(isDark.value)
})
</script>
