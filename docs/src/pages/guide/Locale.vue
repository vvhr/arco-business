<template>
  <PageHeader eyebrow="Guide" title="国际化" description="组件库内置中文和英文语言包，并支持在安装阶段或运行时切换、覆盖文案。" :tags="['zh-CN', 'en-US', 'custom locale']" />

  <SectionBlock id="locale-install" kicker="Install" title="安装时设置语言" description="通过 install options 设置默认语言，适合应用启动时确定语言的场景。">
    <div class="docs-callout">
      <pre class="docs-code-inline">import AcroBusiness from 'arco-business'

app.use(AcroBusiness, {
  locale: 'en-US'
})</pre>
    </div>
  </SectionBlock>

  <SectionBlock id="locale-runtime" kicker="Runtime" title="运行时切换" description="setLocale 会同步组件库内部文案，并触发依赖语言的格式化逻辑。">
    <div class="docs-callout">
      <pre class="docs-code-inline">import { setLocale, getCurrentLocale, supportedLocales } from 'arco-business'

setLocale('zh-CN')
console.log(getCurrentLocale(), supportedLocales)</pre>
    </div>
  </SectionBlock>

  <SectionBlock id="locale-custom" kicker="Custom" title="自定义覆盖" description="customLocale 会与默认语言包深度合并，只需要覆盖业务侧关注的字段。">
    <div class="docs-callout">
      <pre class="docs-code-inline">app.use(AcroBusiness, {
  customLocale: {
    'zh-CN': {
      table: { copy: { success: '已复制到剪贴板' } }
    }
  }
})</pre>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
</script>
