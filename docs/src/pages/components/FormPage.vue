<template>
  <PageHeader
    eyebrow="Components"
    title="AbForm 表单"
    description="Schema 驱动的业务表单组件，用于把布局、输入控件、容器、锚点和自定义渲染组合成稳定的配置化表单。"
    :tags="['Schema driven', 'Anchor form', 'Custom imports']"
  />

  <SectionBlock
    id="form-overview"
    kicker="Overview"
    title="设计目标"
    description="AbForm 面向中后台业务表单，强调 schema 可维护性、布局一致性和局部扩展能力。"
  >
    <FeatureGrid :items="features" />
  </SectionBlock>

  <SectionBlock
    id="form-structure"
    kicker="Structure"
    title="推荐组织方式"
    description="将 schema、默认模型、自定义组件注册和校验行为分开维护，复杂页面会更容易测试和迁移。"
  >
    <div class="docs-callout">
      <pre class="docs-code-inline">const schemas = ref&lt;FormSchema[]&gt;([])
const model = ref&lt;Recordable&gt;({})
const imports: FormImportItem[] = [{ name: 'BusinessField', component: BusinessField }]</pre>
    </div>
  </SectionBlock>

  <SectionBlock
    id="form-arco-diff"
    kicker="Compare"
    title="与 Arco Form 的核心差异"
    description="AbForm 不替代 Arco Form 的基础能力，而是在其上提供业务 schema 引擎，把页面里重复出现的布局、默认值、校验、动态字段和自定义组件注册沉淀为统一配置。"
  >
    <FeatureGrid :items="diffFeatures" />
  </SectionBlock>

  <DemoBlock
    id="form-basic-demo"
    title="基础输入与布局控制"
    description="展示水平、垂直、行内布局切换，禁用态策略和基础校验。"
    :source="basicSource"
  >
    <BasicDemo />
  </DemoBlock>
  <DemoBlock
    id="form-info-demo"
    title="extra / help 插槽"
    description="通过 formItemProps 与命名插槽补充字段说明，适合业务提示和辅助信息。"
    :source="infoSource"
  >
    <InfoDemo />
  </DemoBlock>
  <DemoBlock
    id="form-anchor-demo"
    title="容器与锚点"
    description="容器 schema 可以配合 scrollRef 创建表单内部锚点导航，适合长表单。"
    :source="anchorSource"
  >
    <AnchorDemo />
  </DemoBlock>
  <DemoBlock
    id="form-custom-demo"
    title="禁用态与嵌套表格"
    description="通过 imports 注入自定义字段组件，覆盖嵌套表格、状态标签和渲染函数组件。"
    :source="editSource"
  >
    <EditDemo />
  </DemoBlock>
  <DemoBlock
    id="form-dynamic-demo"
    title="动态 schema、校验与受控模型"
    description="展示 controlled、autoRules、_v_ 动态属性、componentEvent、hidden、excontext 和禁用态样式。"
    :source="dynamicSource"
  >
    <DynamicDemo />
  </DemoBlock>

  <ApiTable
    id="form-api"
    title="Props API"
    description="常用入参汇总，完整类型以导出的 TypeScript 类型为准。"
    :rows="propsRows"
  />
  <ApiTable
    id="form-events"
    title="Events API"
    description="事件主要用于同步业务状态、监听字段变化和接入页面级行为。"
    :rows="eventsRows"
  />
  <ApiTable
    id="form-expose"
    title="Expose API"
    description="通过组件 ref 调用实例方法，适合页面级提交、重置、定位和外部赋值。"
    :rows="exposeRows"
  />
  <ApiTable
    id="form-types"
    title="Types API"
    description="重要导出类型来自组件源码，使用时可从 arco-business 直接导入。"
    :rows="typesRows"
  />
  <ApiTable
    id="form-type-schema-base"
    title="FormSchemaBase 类型"
    description="所有 schema 分支的公共字段，用于表达动态显隐、默认值、布局、渲染和锚点等基础能力。"
    :rows="schemaBaseRows"
  />
  <ApiTable
    id="form-type-input-schema"
    title="FormInputSchema 类型"
    description="普通输入字段的配置结构，是大多数表单项的核心类型。"
    :rows="inputSchemaRows"
  />
  <ApiTable
    id="form-type-container-schema"
    title="FormContainerSchema 类型"
    description="容器 schema 用于组织分组、折叠块和长表单锚点。"
    :rows="containerSchemaRows"
  />
  <ApiTable
    id="form-type-component-props"
    title="FormComponentProps 类型"
    description="字段组件属性会传给 Arco 或自定义组件，额外支持 _v_ 动态属性和 vBinds 扩展双向绑定。"
    :rows="componentPropsRows"
  />
  <ApiTable
    id="form-type-item-props"
    title="FormItemProps 类型"
    description="基于 Arco FormItem 扩展，重点补充自动校验、辅助渲染和字段级布局能力。"
    :rows="formItemRows"
  />
  <ApiTable
    id="form-type-import-item"
    title="FormImportItem 类型"
    description="用于按页面注册业务组件，并声明该组件的 v-model 字段、placeholder 和 options 行为。"
    :rows="importItemRows"
  />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import FeatureGrid from '@docs/components/FeatureGrid.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/form/basic.vue'
import basicSource from '@docs/demos/form/basic.vue?raw'
import InfoDemo from '@docs/demos/form/info.vue'
import infoSource from '@docs/demos/form/info.vue?raw'
import AnchorDemo from '@docs/demos/form/anchor.vue'
import anchorSource from '@docs/demos/form/anchor.vue?raw'
import EditDemo from '@docs/demos/form/edit.vue'
import editSource from '@docs/demos/form/edit.vue?raw'
import DynamicDemo from '@docs/demos/form/schema-dynamics.vue'
import dynamicSource from '@docs/demos/form/schema-dynamics.vue?raw'

const features = [
  { title: '配置驱动', description: '字段、容器、布局和校验规则集中在 schema 中表达。' },
  { title: '局部扩展', description: 'imports 支持按页面注册业务字段组件，不污染全局组件库。' },
  { title: '长表单导航', description: 'anchor 与 scrollRef 可为复杂表单建立内部目录。' }
]

const diffFeatures = [
  { title: 'Schema 即页面协议', description: '字段类型、布局、校验、显隐、默认值和事件由 FormSchema 统一描述。' },
  { title: '业务组件局部接入', description: 'imports 可注册页面私有组件，避免把一次性业务控件挂到全局。' },
  { title: '读写态复用', description: 'controlled、disabledStyles 与 schemaProps 让创建页、编辑页和详情页共用一份配置。' }
]

const propsRows: ApiRow[] = [
  { name: 'model', description: '表单数据对象，支持 v-model:model。', type: 'Recordable', defaultValue: '{}' },
  { name: 'controlled', description: '是否由外部完全控制 model，同步通过 update:model 完成。', type: 'boolean', defaultValue: 'false' },
  { name: 'schemas', description: '表单 schema 配置。', type: 'FormSchema[]', defaultValue: '[]' },
  { name: 'stepValue', description: '步骤表单当前步骤值，配合 Step schema 使用。', type: 'number | null', defaultValue: 'null' },
  { name: 'disabled', description: '是否整体禁用表单。', type: 'boolean', defaultValue: 'false' },
  { name: 'size', description: '表单尺寸，继承 Arco Form 尺寸语义。', type: 'mini | small | medium | large', defaultValue: 'medium' },
  { name: 'layout', description: '表单布局。', type: 'horizontal | vertical | inline', defaultValue: 'horizontal' },
  { name: 'labelAlign', description: '标签对齐方式。', type: 'left | right', defaultValue: 'right' },
  { name: 'labelColProps', description: '标签列布局配置，透传给栅格列。', type: 'Recordable', defaultValue: '{ span: 5 }' },
  { name: 'wrapperColProps', description: '控件列布局配置，透传给栅格列。', type: 'Recordable', defaultValue: '{ span: 19 }' },
  { name: 'labelColStyle', description: '标签列样式。', type: 'CSSProperties', defaultValue: '-' },
  { name: 'wrapperColStyle', description: '控件列样式。', type: 'CSSProperties', defaultValue: '-' },
  { name: 'labelColFlex', description: '标签列 flex 宽度。', type: 'string | number', defaultValue: '-' },
  { name: 'designable', description: '是否启用设计态辅助能力。', type: 'boolean', defaultValue: 'false' },
  { name: 'designableDirectives', description: '设计态指令配置。', type: 'FormDesignableDirectives', defaultValue: '{}' },
  { name: 'designableColProps', description: '设计态列属性函数。', type: 'FormDesignableColProps', defaultValue: '() => ({})' },
  { name: 'excontext', description: '传给 schema 函数、渲染函数和事件函数的页面上下文。', type: 'Recordable', defaultValue: '{}' },
  { name: 'schemaProps', description: '全局 schema 默认属性，可统一设置 layout、formItem 和 component 配置。', type: 'FormSchemaProps', defaultValue: '{}' },
  { name: 'showErrorNotice', description: '校验失败时是否展示错误提示。', type: 'boolean', defaultValue: 'true' },
  { name: 'scrollRef', description: '滚动容器元素，用于锚点和 scrollToKey 定位。', type: 'HTMLElement | null', defaultValue: 'null' },
  { name: 'autoInitField', description: '是否根据 schema 自动初始化字段默认值。', type: 'boolean', defaultValue: 'true' },
  { name: 'imports', description: '局部注册自定义表单组件。', type: 'FormImportItem[]', defaultValue: '[]' },
  { name: 'anchor', description: '是否启用容器锚点导航。', type: 'boolean', defaultValue: 'false' },
  { name: 'anchorProps', description: '锚点组件属性。', type: 'Recordable', defaultValue: '{}' },
  { name: 'anchorAffixStyle', description: '锚点吸附容器样式。', type: 'CSSProperties', defaultValue: '{}' },
  { name: 'disabledStyles', description: '禁用态显示策略。', type: 'FormDisabledStyles', defaultValue: '内置文本化禁用样式' }
]

const eventsRows: ApiRow[] = [
  { name: 'register', description: '表单实例注册回调。', type: '(formRef: FormInstance) => void', defaultValue: '-' },
  { name: 'update:stepValue', description: '步骤值变化时触发。', type: '(stepValue: number | null) => void', defaultValue: '-' },
  { name: 'init', description: '表单初始化后触发。', type: '(form: Recordable) => void', defaultValue: '-' },
  { name: 'change', description: '字段值变化时触发。', type: '(data: { value: any; field: string; oldValue: any }) => void', defaultValue: '-' },
  { name: 'update:model', description: 'controlled 模式下同步外部 model。', type: '(model: Recordable) => void', defaultValue: '-' }
]

const exposeRows: ApiRow[] = [
  { name: 'initValues', description: '按初始数据重新初始化表单字段。', type: '(initModel?: Recordable) => void', defaultValue: '-' },
  { name: 'getDefaultModel', description: '根据 schema 计算默认表单数据。', type: '(defaultModel?: Recordable) => Recordable', defaultValue: '-' },
  { name: 'getFormModel', description: '获取组件内部维护的表单数据。', type: '() => Recordable', defaultValue: '-' },
  { name: 'getFormRef', description: '获取 Arco Form 原始实例。', type: '() => FormRawInstance | undefined', defaultValue: '-' },
  { name: 'setValues', description: '批量设置字段值。', type: '(data?: Recordable) => void', defaultValue: '-' },
  { name: 'clearValues', description: '清空字段值，并可传入默认模型。', type: '(defaultModel?: Recordable) => void', defaultValue: '-' },
  { name: 'setValue', description: '设置单个字段值。', type: '(key: string, value: any) => void', defaultValue: '-' },
  { name: 'delValue', description: '删除单个字段值。', type: '(key: string) => boolean', defaultValue: '-' },
  { name: 'validate', description: '触发表单校验，返回是否通过。', type: '() => Promise<boolean>', defaultValue: '-' },
  { name: 'resetValidate', description: '清空表单校验状态。', type: '() => void', defaultValue: '-' },
  { name: 'scrollToKey', description: '滚动到指定 schema key 对应区域。', type: '(key: string) => void', defaultValue: '-' }
]

const typesRows: ApiRow[] = [
  { name: 'FormSchema', description: '表单 schema 联合类型，覆盖步骤、容器、装饰器、输入项和自定义渲染。', type: 'FormStepSchema | FormContainerSchema | FormDecoratorSchema | FormInputSchema | FormCustomSchema', defaultValue: '-' },
  { name: 'FormInputSchema', description: '普通输入字段配置，必须包含 field 和 component。', type: '{ field; component; label?; value?; componentProps?; formItemProps?; ... }', defaultValue: '-' },
  { name: 'FormContainerSchema', description: '容器配置，用于 Group、Blank、Disclosure 或自定义容器。', type: '{ key; type: "Container"; component; children; anchorLinkProps?; ... }', defaultValue: '-' },
  { name: 'FormDecoratorSchema', description: '装饰节点配置，用于 Divider、Alert、Image、Result、Text 等非输入控件。', type: '{ key; type: "Decorator"; component; componentProps?; ... }', defaultValue: '-' },
  { name: 'FormCustomSchema', description: '自定义渲染字段配置，通过 render 返回 VNode。', type: '{ field; type: "Custom"; render?: FormSchemaDomFn<VNode>; ... }', defaultValue: '-' },
  { name: 'FormSchemaFn<T>', description: '动态属性函数，可读取 form、schema、disabled 和 excontext。', type: '(form, schema, disabled, excontext) => T', defaultValue: '-' },
  { name: 'FormSchemaDomFn<T>', description: '动态渲染函数，额外支持业务参数。', type: '(form, schema, disabled, excontext, ...args) => T', defaultValue: '-' },
  { name: 'FormComponentProps', description: '传给字段组件的属性，支持 _v_ 前缀动态属性。', type: '{ disabled?; options?; fieldNames?; vBinds?; [key: string]: any }', defaultValue: '-' },
  { name: 'FormItemProps', description: 'Arco FormItem 属性扩展，支持 extraRender、helpRender 和 autoRules。', type: 'Omit<ArcoFormItemProps, ...> & { noLabel?; rules?; autoRules?; ... }', defaultValue: '-' },
  { name: 'FormImportItem', description: '局部注册组件配置，用于引入业务组件或覆盖默认组件。', type: '{ name: string; component: Component; config?: FormImportItemConfig; isArrayFn?: (...) => boolean }', defaultValue: '-' }
]

const schemaBaseRows: ApiRow[] = [
  { name: 'key', description: 'schema 唯一 key；容器、装饰器和自定义定位建议显式配置。', type: 'string', defaultValue: '-' },
  { name: 'field', description: '表单字段路径，输入项和自定义字段使用。', type: 'string', defaultValue: '-' },
  { name: 'type', description: 'schema 分支类型。', type: 'Step | Container | Decorator | Custom | Inputer', defaultValue: 'Inputer' },
  { name: 'label', description: '字段标签，支持静态值或 FormSchemaFn 动态计算。', type: 'string | FormSchemaFn<string>', defaultValue: '-' },
  { name: 'hidden', description: '是否隐藏当前节点，函数可读取 form、disabled 和 excontext。', type: 'boolean | FormSchemaFn<boolean>', defaultValue: 'false' },
  { name: 'value', description: '字段默认值，autoInitField 开启时参与初始化。', type: 'any | FormSchemaFn<any>', defaultValue: 'null' },
  { name: 'componentProps', description: '传给字段组件的属性。', type: 'FormComponentProps', defaultValue: '{}' },
  { name: 'componentEvent', description: '字段组件事件映射，事件函数会补齐 form、schema、disabled 和 excontext。', type: 'FormComponentEvents', defaultValue: '{}' },
  { name: 'layoutProps', description: '字段或容器栅格布局。', type: 'FormLayoutProps', defaultValue: '{}' },
  { name: 'outsideProps / insideProps', description: '字段外侧和内部插槽、渲染函数配置。', type: 'FormOutsideProps / FormInsideProps', defaultValue: '{}' }
]

const inputSchemaRows: ApiRow[] = [
  { name: 'field', description: '必填，写入 form model 的字段路径。', type: 'string', defaultValue: '-' },
  { name: 'component', description: '必填，内置输入组件名或 imports 注册的组件名。', type: 'FormInputName | string', defaultValue: 'Input' },
  { name: 'formItemProps', description: '字段级 FormItem 配置和校验规则。', type: 'FormItemProps', defaultValue: '{}' },
  { name: 'componentProps', description: '输入控件属性，支持 options 函数和 _v_ 动态属性。', type: 'FormComponentProps', defaultValue: '{}' },
  { name: 'outsideProps', description: '输入组件外层前后缀区域。', type: 'FormOutsideProps', defaultValue: '{}' },
  { name: 'insideProps', description: '输入组件内部插槽或渲染函数。', type: 'FormInsideProps', defaultValue: '{}' }
]

const containerSchemaRows: ApiRow[] = [
  { name: 'key', description: '必填，容器 key 也会作为锚点定位依据。', type: 'string', defaultValue: '-' },
  { name: 'type', description: '固定为 Container。', type: 'Container', defaultValue: '-' },
  { name: 'component', description: '容器组件名，内置 Group、Blank、Disclosure。', type: 'FormContainerName | string', defaultValue: 'Group' },
  { name: 'children', description: '容器下的子 schema。', type: 'FormSchema[]', defaultValue: '[]' },
  { name: 'anchorLinkProps', description: '锚点链接标题、href 和显隐控制。', type: 'FormAnchorLinkProps', defaultValue: '{}' }
]

const componentPropsRows: ApiRow[] = [
  { name: 'freshKey', description: '强制刷新字段组件实例。', type: 'string | number', defaultValue: '-' },
  { name: 'disabled', description: '字段级禁用态，可使用函数动态计算。', type: 'boolean | FormSchemaFn<boolean>', defaultValue: 'false' },
  { name: 'allowClear', description: '清空按钮开关，常由 schemaProps 批量设置。', type: 'boolean', defaultValue: 'true' },
  { name: 'options', description: '选择类组件选项，支持函数读取 form 和 excontext。', type: 'any[] | FormSchemaFn<any[]>', defaultValue: '[]' },
  { name: '_v_xxx', description: '动态属性，_v_options 会在运行时计算为 options。', type: 'FormSchemaFn<any>', defaultValue: '-' },
  { name: 'vBinds', description: '扩展 v-model 绑定映射，用于同步组件的额外 model 字段。', type: 'Record<string, string>', defaultValue: '{}' }
]

const formItemRows: ApiRow[] = [
  { name: 'rules', description: 'Arco FieldRule 校验规则。', type: 'FieldRule | FieldRule[]', defaultValue: '[]' },
  { name: 'autoRules', description: '内置自动校验规则名，如 isRequired、isMobilePhone、isEmail。', type: 'AutoRules[]', defaultValue: '[]' },
  { name: 'extra / help', description: '字段辅助说明文本。', type: 'string', defaultValue: '-' },
  { name: 'extraRender / helpRender', description: '字段辅助说明渲染函数。', type: 'FormSchemaDomFn<VNodeChild | false>', defaultValue: '-' },
  { name: 'layout / labelAlign', description: '字段级覆盖表单布局和标签对齐方式。', type: 'FormLayout / FormLabelAlign', defaultValue: '-' },
  { name: 'noLabel', description: '隐藏标签但保留字段结构。', type: 'boolean | FormSchemaFn<boolean>', defaultValue: 'false' }
]

const importItemRows: ApiRow[] = [
  { name: 'name', description: 'schema.component 使用的组件名。', type: 'string', defaultValue: '-' },
  { name: 'component', description: 'Vue 组件对象。', type: 'Component', defaultValue: '-' },
  { name: 'config.modelValueKey', description: '自定义组件的 v-model 字段名。', type: 'string', defaultValue: 'modelValue' },
  { name: 'config.needOptions', description: '是否按选择类组件处理 options。', type: 'boolean', defaultValue: 'false' },
  { name: 'config.optionsPropName', description: '选项属性名，可适配 data/options 差异。', type: 'options | data', defaultValue: 'options' },
  { name: 'isArrayFn', description: '判断当前组件值是否为数组的函数。', type: '(cps: Recordable) => boolean', defaultValue: '-' }
]
</script>
