<template>
  <PageHeader eyebrow="Guide" title="扩展组件" description="AbForm 和 AbTable 都支持全局注册自定义组件，也支持通过 imports 做页面级局部注册。" :tags="['Form imports', 'Table imports', 'Global register']" />

  <SectionBlock id="extend-components-global" kicker="Global" title="全局注册" description="适合业务系统中频繁复用的输入组件，如用户选择器、组织树、文件选择器。">
    <div class="docs-callout">
      <pre class="docs-code-inline">import AcroBusiness from 'acro-business'
import UserPicker from './components/UserPicker.vue'

app.use(AcroBusiness, {
  formImports: [{
    name: 'UserPicker',
    component: UserPicker,
    config: { needAllowClear: true, needSelectPlaceholder: true }
  }],
  tableImports: [{
    name: 'UserPicker',
    component: UserPicker,
    config: { needAllowClear: true, needSelectPlaceholder: true }
  }]
})</pre>
    </div>
  </SectionBlock>

  <SectionBlock id="extend-components-local" kicker="Local" title="局部注册" description="适合只在当前页面使用的一次性业务字段，避免污染全局注册表。">
    <div class="docs-callout">
      <pre class="docs-code-inline">&lt;AbForm :schemas="schemas" :imports="imports" /&gt;

const imports = [{ name: 'BusinessField', component: BusinessField }]
const schemas = [{ field: 'owner', label: '负责人', component: 'BusinessField' }]</pre>
    </div>
  </SectionBlock>

  <SectionBlock id="extend-components-config" kicker="Config" title="组件配置含义" description="config 用于告诉范式引擎如何为自定义组件生成 v-model、placeholder、allowClear 和 options。">
    <FeatureGrid :items="configs" />
  </SectionBlock>
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import FeatureGrid from '@docs/components/FeatureGrid.vue'

const configs = [
  { title: 'modelValueKey', description: '自定义组件不是 modelValue 时，声明它的双向绑定字段。' },
  { title: 'needOptions', description: '让组件按选择类控件处理 options，并支持动态 options 函数。' },
  { title: 'optionsPropName', description: '适配 options 或 data 等不同选项属性名。' },
  { title: 'needAllowClear', description: '自动注入 allowClear，保持和内置组件一致的清空体验。' },
  { title: 'needInputPlaceholder', description: '按输入类组件生成“请输入 xxx”占位提示。' },
  { title: 'needSelectPlaceholder', description: '按选择类组件生成“请选择 xxx”占位提示。' }
]
</script>
