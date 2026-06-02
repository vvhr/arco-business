<template>
  <PageHeader
    eyebrow="Guide"
    title="介绍"
    description="Acro Business 的核心是把中后台高频表单和表格沉淀为配置驱动的范式引擎，同时继承 Arco Design Vue 的原生能力。"
    :tags="['Schema', 'Pattern engine', 'Arco native']"
  />

  <SectionBlock id="intro-ideas" kicker="Concept" title="核心思想" description="组件库不追求替代原生组件，而是把重复的业务范式抽象成稳定协议。">
    <FeatureGrid :items="ideas" />
  </SectionBlock>

  <SectionBlock id="intro-schema-map" kicker="Map" title="Schema 与 DOM 的对应关系" description="FormSchema 和 TableColumn 都是业务页面的描述协议，组件运行时会把配置翻译为 Arco 组件、内置渲染器和业务交互。">
    <div class="docs-schema-map">
      <div>
        <strong>schemas / columns</strong>
        <span>field、label、component、type、editProps</span>
      </div>
      <div>
        <strong>动态能力</strong>
        <span>hidden、_v_ props、componentEvent、excontext</span>
      </div>
      <div>
        <strong>组件渲染</strong>
        <span>Arco 输入组件、AbUpload、AbTable、AbText、自定义 imports</span>
      </div>
      <div>
        <strong>真实 DOM</strong>
        <span>FormItem、TableCell、操作按钮、校验信息、滚动容器</span>
      </div>
    </div>
  </SectionBlock>

  <SectionBlock id="intro-efficiency" kicker="Efficiency" title="效率来自规范" description="一份配置可以复用到创建页、编辑页和详情页，并通过上下文透传实现动态联动。">
    <div class="docs-callout">
      <pre class="docs-code-inline">const schemas: FormSchema[] = [{
  field: 'department',
  label: '部门',
  component: 'Select',
  componentProps: {
    _v_options: (form, schema, disabled, excontext) => excontext.departments
  },
  formItemProps: { autoRules: ['isRequired'] }
}]</pre>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import FeatureGrid from '@docs/components/FeatureGrid.vue'

const ideas = [
  { title: '配置驱动', description: '用 FormSchema 和 TableColumn 描述页面结构、校验、格式化和操作。' },
  { title: '范式引擎', description: '表单布局、编辑表格、操作列、字典、脱敏、上传等高频范式统一收敛。' },
  { title: '继承原生', description: '在 Arco Design Vue 之上扩展，保留可透传的原生能力和交互语义。' },
  { title: '上下文透传', description: 'excontext 将页面状态注入动态属性、事件、渲染和权限控制。' },
  { title: '动态联动', description: 'hidden、_v_ 动态属性、componentEvent 支持字段级联和动态选项。' },
  { title: '灵活校验', description: 'rules 与 autoRules 兼容手写规则和内置快捷校验。' }
]
</script>
