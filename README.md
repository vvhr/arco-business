<div align="center">

  <img src="http://arco.vvhrdesign.com/logo.svg" alt="Acro Business" width="200" height="40" />

  <p>基于 Vue 3 和 Arco Design Vue 构建的<strong>配置驱动</strong>高级组件库</p>
  
  [![npm version](https://img.shields.io/npm/v/arco-business.svg?style=flat-square)](https://www.npmjs.com/package/arco-business)
  [![npm downloads](https://img.shields.io/npm/dt/arco-business.svg?style=flat-square)](https://www.npmjs.com/package/arco-business)
  [![license](https://img.shields.io/npm/l/arco-business.svg?style=flat-square)](https://github.com/vvhr/arco-business/blob/main/LICENSE)
  [![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=flat-square)](https://pnpm.io/)
  [![Vue](https://img.shields.io/badge/Vue-≥3.2.0-green?style=flat-square&logo=vue.js)](https://vuejs.org/)
  [![Arco Design Vue](https://img.shields.io/badge/Arco%20Design%20Vue-≥2.58.0-165dff?style=flat-square)](https://arco.design/vue/docs/start)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  
</div>  

基于 Vue 3 和 Arco Design Vue 的高级业务组件库，面向中后台系统沉淀表单、表格、上传、图标、弹窗、抽屉和文本状态等高频业务范式。

Acro Business 不替代 Arco Design Vue 的基础组件能力，而是在其之上提供更贴近业务交付的配置协议、组合组件和扩展入口。

## 文档

[Acro Business Docs](http://arco.vvhrdesign.com)

## 特性

- **配置驱动：** 使用 `FormSchema` 和 `TableColumn` 描述字段、列、布局、校验、格式化和交互。
- **业务范式复用：** 内置表单引擎、表格引擎、上传、弹窗、抽屉、状态文本和组合输入器。
- **继承 Arco 能力：** 保留 Arco Design Vue 的 props、事件、插槽和主题体系。
- **扩展友好：** 支持注册自定义表单组件、表格编辑组件和 Iconify 图标集。
- **TypeScript 优先：** 导出组件实例、props、emits、schema、columns、工具函数等类型。
- **国际化：** 内置 `zh-CN` 和 `en-US`，支持运行时切换和自定义语言包覆盖。

## 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Vue >= 3.2.0
- @arco-design/web-vue >= 2.58.0
- 精确十进制运算需要支持原生 BigInt 的浏览器。

## 金额与正文布局

`AbAmountInput` 的编辑输出为十进制字符串，支持 `precision`、`emptyValue`、`readonly`、`disabled`、`showChineseUppercase` 和千分位配置。表单 schema 与表格编辑组件名均为 `AmountInput`，无需另行注册；回填及只聚焦失焦不触发业务 `change`。

### AbTable 编辑属性契约

`editProps.componentProps` 提供静态默认值，`editProps._v_componentProps` 在每次编辑单元格渲染时返回动态增量。二者浅合并，同名属性由动态值覆盖；动态结果未包含的属性保留静态值，显式 `undefined` 会覆盖静态值。回调返回 `null`、`undefined` 或不返回值等同于没有增量。`style`、`fieldNames`、`vBinds` 等对象属性整体替换，不深合并。

动态回调签名为 `(row, index, column, form, excontext, editable)`，依次传入真实业务行对象、当前展示行索引（从 0 开始）、业务列、外部表单、扩展上下文和表格编辑状态。`disabled` 与 `options` 的函数值也使用这一签名，并在合并后执行；被覆盖的静态函数不会执行。未设置或显式清除 `disabled` 时恢复为 `false`，`freshKey` 恢复为 `0`。显式 `placeholder: undefined` 清除静态及自动提示，交给组件自身处理。

渲染、禁用状态、选项、额外双向绑定与刷新 key 使用同一份有效属性，因此可以完全省略静态配置：

```ts
const column: TableColumn = {
  field: 'ownerId',
  label: '负责人',
  editProps: {
    component: 'OwnerPicker', // 通过 imports 注册，支持 label / update:label
    _v_componentProps: (row, index, column, form, context, editable) => ({
      options: context.ownersByCategory[row.category] || [],
      disabled: row.locked,
      disabledPlaceholder: '--',
      placeholder: `请选择${column.label}`,
      vBinds: { label: row.useAlias ? 'owner.alias' : 'owner.name' },
      freshKey: row.editorVersion
    })
  }
}
```

`vBinds` 将组件属性映射到当前行的字段路径，自动回填属性并监听 `update:属性名` 回写；动态切换映射后，后续事件写入新路径。返回 `{ vBinds: undefined }` 或 `{ vBinds: {} }` 可取消额外绑定。保持既有值优先级：行模型生成的主字段和额外绑定值作为默认值，显式配置的组件属性（含 `modelValue`、自定义模型属性及显式 `undefined`）优先；同名 `onUpdate:*` 属性监听器和 `componentEvent` 监听器仍会执行，且不会覆盖内部回写。`vBinds`、`freshKey`、`disabledPlaceholder` 为表格内部配置，不透传到编辑组件。

`disabledPlaceholder` 可放在静态或动态属性中：字段最终禁用时覆盖提示，解禁后恢复自定义或自动提示。最终状态在绑定与显式组件属性合并后计算，并遵循 Arco 规则：`editProps.formItemProps.disabled: true` 也会禁用组件，组件自身的 `disabled: false` 无法解除表单项禁用。支持通过 `vBinds: { disabled: 'locked' }` 绑定行禁用状态。未配置占位策略时保持原提示；空字符串可隐藏禁用提示。`RangePicker` 和 `type: 'time-range'` 的 `TimePicker` 会将字符串复制为两端提示，也可直接传入字符串数组。

`formatAmount` 保留十进制字符串精度，`sumAmounts(values, precision?)` 先精确累加后舍入；未指定 precision 时保留完整有效小数，指定时补齐对应位数。空值和非法值不计入合计。列级旧 `summaryMethod(values)` 仍接收 number 数组；要求精度的自定义合计请使用表格级 `summaryMethod({ rawData })` 与 `sumAmounts`。

`AbTable` 可通过 `amountDefaults` 设置共享金额策略，列级 `typeProps` 优先。`amountZeroDisplay` 可指定零值显示，`amountZeroClickable: false` 可关闭零值点击；未设置时保留原有行为。金额类型列现在也支持 `render` 和 `formatter`，优先级与默认列一致。

分页先同步 page/pageSize 模型再发出查询事件；切换每页条数时等待同轮页码自动调整结束，再派发一次最终 page-change。常规换页仍即时通知。

Modal 和 Drawer 均支持 `contentStyle` 与 `contentLayout="flex"`，分别设置实际正文容器样式和可收缩的纵向布局；滚动与非滚动模式均生效。默认留白保持原值，复杂详情可显式传 `:content-style="{ padding: 0 }"`，由业务子区域拥有滚动和留白。`bodyStyle` 仍作用于外层 Arco body，Modal 原有 `noScrollbarStyle` 继续兼容，显式 `contentStyle` 优先。

## 安装

```bash
pnpm add arco-business @arco-design/web-vue
```

使用本文新增金额能力的预发布版本时，显式安装 beta（发布后可用）：

```bash
pnpm add arco-business@0.0.5-beta.1 @arco-design/web-vue
```

## 快速开始

### 全量注册

```ts
import { createApp } from 'vue'
// 引入Arco组件库
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
// 引入Arco图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 引入本项目组件库
import AcroBusiness from 'arco-business'
// 引入本项目样式
import 'arco-business/style.css'

import App from './App.vue'

createApp(App).use(ArcoVue).use(AcroBusiness).mount('#app')
```

### 按需使用

```vue
<template>
  <AbForm :schemas="schemas" v-model:model="model" controlled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbForm, type FormSchema } from 'arco-business'
import 'arco-business/style.css'

const model = ref({})

const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    formItemProps: {
      autoRules: ['isRequired']
    }
  }
]
</script>
```

## 组件

| 组件 | 说明 |
| --- | --- |
| `AbForm` | Schema 驱动的业务表单，支持布局、动态属性、校验、只读态和自定义组件。 |
| `AbTable` | 面向列表页和可编辑表格的业务表格，支持操作列、选择、展开、合计和编辑态。 |
| `AbAmountInput` | 字符串金额输入，支持可配置精度、千分位、中文大写及真实数值变更通知。 |
| `AbIcon` | 基于 Iconify 的图标组件，支持内置图标和自定义图标集。 |
| `AbUpload` | 业务上传组件，统一文件字段映射、列表展示和上传交互。 |
| `AbModal` | 对 Arco Modal 的业务封装，适合标准确认、表单弹窗和异步关闭。 |
| `AbDrawer` | 对 Arco Drawer 的业务封装，适合侧边编辑、详情和流程操作。 |
| `AbText` | 增强文本展示，支持状态点、块状态、高亮、脱敏和格式化。 |
| `AbComboInput` | 组合输入器，适合前缀选择、复合字段和条件输入场景。 |

## 扩展能力

### 注册自定义组件

```ts
import AcroBusiness from 'arco-business'
import UserPicker from './components/UserPicker.vue'

app.use(AcroBusiness, {
  formImports: [
    {
      name: 'UserPicker',
      component: UserPicker,
      config: {
        needAllowClear: true,
        needSelectPlaceholder: true
      }
    }
  ],
  tableImports: [
    {
      name: 'UserPicker',
      component: UserPicker
    }
  ]
})
```

### 注册自定义图标集

```ts
import AcroBusiness from 'arco-business'

app.use(AcroBusiness, {
  iconCollections: [
    {
      prefix: 'biz',
      icons: {
        approve: {
          body: '<path d="M4 12l4 4L20 6"/>'
        }
      }
    }
  ]
})
```

### 设置语言

```ts
import AcroBusiness, { setLocale } from 'arco-business'

app.use(AcroBusiness, {
  locale: 'zh-CN'
})

setLocale('en-US')
```

## 工具函数

组件库导出常用业务工具：

- `getAutoRulesMap`：获取内置快捷校验规则。
- `useDict`：处理字典映射。
- `formatAmount`、`formatDate`、`formatSensitive`：金额、日期和脱敏格式化。
- `formatDecimal`、`sumAmounts`：精确十进制字符串格式化和求和。
- `findNode`、`findNodes`：树结构节点查询。
- `setLocale`、`getCurrentLocale`、`setCustomLocale`：语言切换和语言包覆盖。

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动文档站
pnpm dev

# 类型检查
pnpm check

# 构建组件库
pnpm build

# 构建文档站
pnpm docs:build
```

文档站源码位于 [docs](./docs) 目录，默认开发端口为 `8989`。

## 发布前检查

```bash
pnpm build
pnpm prepack:check
npm pack --dry-run
```

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md)。

## 许可证

[MIT](./LICENSE)
