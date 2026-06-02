<template>
  <div class="home-page">
    <header class="home-nav">
      <RouterLink class="home-brand" to="/">
        <BrandMark />
      </RouterLink>
      <nav>
        <RouterLink to="/guide/quick-start">指南</RouterLink>
        <RouterLink to="/components/form">组件</RouterLink>
        <RouterLink to="/components/table">表格</RouterLink>
        <a href="https://github.com/vvhr/arco-business" target="_blank">GitHub</a>
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
            <span>Arco Design Vue business components</span>
          </div>
          <h1>面向中后台的高级业务组件库</h1>
          <p>
            以表单、表格、图标和业务容器为核心，把商业项目里的高频页面模式沉淀成可配置、可扩展、可继承的组件引擎。
          </p>
          <div class="home-hero__actions">
            <RouterLink class="home-button home-button--primary" to="/guide/quick-start">开始使用</RouterLink>
            <RouterLink class="home-button" to="/components/form">查看表单引擎</RouterLink>
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
              <strong>Business component engine</strong>
              <small>schema + slots + native arco props</small>
            </div>
          </div>
          <div class="home-product__flow">
            <article>
              <b>创建页</b>
              <span>配置字段、布局、校验和提交行为</span>
            </article>
            <article>
              <b>编辑页</b>
              <span>复用同一份 schema 和组件插槽</span>
            </article>
            <article>
              <b>详情页</b>
              <span>切换只读态，保留字段语义和展示规则</span>
            </article>
          </div>
          <div class="home-product__stack">
            <span>AbForm</span>
            <span>AbTable</span>
            <span>AbIcon</span>
            <span>AbUpload</span>
          </div>
        </div>
      </section>

      <section class="home-band" data-anchor-title="Components">
        <div>
          <p>Component library</p>
          <h2>组件库解决的是业务页面的重复建设，而不是单个 UI 控件的再次封装</h2>
          <span>
            Acro Business 基于 Arco Design Vue，面向表单录入、列表查询、图标表达和上传交互等中后台高频场景，提供更贴近业务交付的组合能力。
          </span>
        </div>
        <div class="home-system">
          <article>
            <strong>配置驱动</strong>
            <span>用 schema 描述字段、列、布局和交互，把页面差异收敛到配置层。</span>
          </article>
          <article>
            <strong>业务组合</strong>
            <span>把 Arco 原子能力组合成表单、表格、上传、文本等业务组件。</span>
          </article>
          <article>
            <strong>工程复用</strong>
            <span>同一套组件可沉淀团队范式，降低不同业务线的实现分歧。</span>
          </article>
        </div>
      </section>

      <section class="home-advantages">
        <article class="home-advantage home-advantage--large">
          <span>高可用</span>
          <h3>商业级沉淀的表单、表格和图标范式引擎</h3>
          <p>组件来自中后台项目的长期复用场景，覆盖查询、编辑、只读、嵌套、校验、选择、合计和状态展示等高频交互。</p>
        </article>
        <article class="home-advantage">
          <span>可扩展</span>
          <h3>自定义组件和插槽能力完整开放</h3>
          <p>表单引擎支持字段级、容器级和渲染级自定义，可接入团队已有组件。</p>
        </article>
        <article class="home-advantage">
          <span>高效率</span>
          <h3>一份配置复用多种页面状态</h3>
          <p>创建页、编辑页和详情页共享字段定义，通过状态切换完成编辑态和只读态复用。</p>
        </article>
        <article class="home-advantage home-advantage--wide">
          <span>原生继承</span>
          <h3>基于 Arco Design Vue，并保留原组件的原生能力</h3>
          <p>在增强业务封装的同时，继续继承 Arco Design Vue 的 props、事件、插槽和主题体系，避免业务组件成为新的能力边界。</p>
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
