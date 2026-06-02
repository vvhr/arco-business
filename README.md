<div align="center">

  <a href="https://github.com/vvhr/acro-business">
    <img src="https://arco.vvhrdesign.com/logo.svg" alt="Acro Business" width="174" height="24" />
  </a>

  <p>基于 Vue 3 和 Arco Design Vue 构建的<strong>配置驱动</strong>高级组件库</p>
  
  [![npm version](https://img.shields.io/npm/v/acro-business.svg?style=flat-square)](https://www.npmjs.com/package/acro-business)
  [![npm downloads](https://img.shields.io/npm/dt/acro-business.svg?style=flat-square)](https://www.npmjs.com/package/acro-business)
  [![license](https://img.shields.io/npm/l/acro-business.svg?style=flat-square)](https://github.com/vvhr/acro-business/blob/main/LICENSE)
  [![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=flat-square)](https://pnpm.io/)
  [![Vue](https://img.shields.io/badge/Vue-≥3.2.0-green?style=flat-square&logo=vue.js)](https://vuejs.org/)
  [![Arco Design Vue](https://img.shields.io/badge/Arco%20Design%20Vue-≥2.58.0-165dff?style=flat-square)](https://arco.design/vue/docs/start)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  
</div>  

基于 Vue 3 和 Arco Design Vue 的高级业务组件库，面向中后台系统沉淀表单、表格、上传、图标、弹窗、抽屉和文本状态等高频业务范式。

Acro Business 不替代 Arco Design Vue 的基础组件能力，而是在其之上提供更贴近业务交付的配置协议、组合组件和扩展入口。

## 文档

[Acro Business Docs](https://arco.vvhrdesign.com)

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

## 安装

```bash
pnpm add acro-business @arco-design/web-vue
```

## 快速开始

### 全量注册

```ts
import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import AcroBusiness from 'acro-business'
import 'acro-business/style.css'
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
import { AbForm, type FormSchema } from 'acro-business'
import 'acro-business/style.css'

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
| `AbIcon` | 基于 Iconify 的图标组件，支持内置图标和自定义图标集。 |
| `AbUpload` | 业务上传组件，统一文件字段映射、列表展示和上传交互。 |
| `AbModal` | 对 Arco Modal 的业务封装，适合标准确认、表单弹窗和异步关闭。 |
| `AbDrawer` | 对 Arco Drawer 的业务封装，适合侧边编辑、详情和流程操作。 |
| `AbText` | 增强文本展示，支持状态点、块状态、高亮、脱敏和格式化。 |
| `AbComboInput` | 组合输入器，适合前缀选择、复合字段和条件输入场景。 |

## 扩展能力

### 注册自定义组件

```ts
import AcroBusiness from 'acro-business'
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
import AcroBusiness from 'acro-business'

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
import AcroBusiness, { setLocale } from 'acro-business'

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
