# Acro Business 文档站

`docs` 是 Acro Business 的独立 Vite 文档站，用于维护组件介绍、快速开始、扩展指南、在线示例、API 表格和源码预览。

文档站服务于组件库维护者和业务使用者。组件库源码仍位于根目录 [src](../src)，文档站通过别名引用组件库源码和示例代码。

## 技术栈

- Vue 3
- Vue Router
- Vite
- Arco Design Vue
- UnoCSS
- Shiki

## 本地开发

在项目根目录执行：

```bash
pnpm install
pnpm dev
```

`pnpm dev` 等价于：

```bash
pnpm docs:dev
```

默认开发端口为 `8989`，配置文件位于 [vite.config.ts](./vite.config.ts)。

## 构建

```bash
pnpm docs:build
```

构建产物输出到根目录 `dist-docs`，可用于静态站点部署。

本地预览构建产物：

```bash
pnpm docs:preview
```

## 目录结构

```text
docs
├── index.html
├── vite.config.ts
└── src
    ├── App.vue
    ├── main.ts
    ├── router.ts
    ├── assets
    ├── components
    ├── demos
    ├── layouts
    ├── pages
    ├── styles
    ├── types
    └── utils
```

## 路由与导航

文档站路由和侧边导航统一维护在 [src/router.ts](./src/router.ts)。

当前导航分为两组：

- **指南：** 介绍、快速开始、国际化、扩展组件、扩展图标。
- **组件：** `AbForm`、`AbTable`、`AbIcon`、`AbUpload`、`AbModal`、`AbDrawer`、`AbText`、`AbComboInput`。

新增页面时，需要同时补充：

- `docs/src/pages` 下的页面组件。
- `docs/src/router.ts` 中的路由配置。
- `navGroups` 中的导航项。

## 示例代码

组件示例统一放在 `docs/src/demos`：

```text
docs/src/demos
├── form
├── table
├── icon
├── upload
├── modal
├── drawer
├── text
└── combo-input
```

页面通过 `DemoBlock` 展示示例和源码。新增示例时，建议按组件名创建目录，并使用能表达场景的文件名，例如 `basic.vue`、`advanced.vue`、`selection.vue`。

## 常用组件

- `PageHeader`：页面标题、描述和标签。
- `SectionBlock`：页面内容分区。
- `FeatureGrid`：特性列表。
- `ApiTable`：API 参数表格。
- `DemoBlock`：示例预览和源码展示。
- `BrandMark`：文档站品牌标识。

## 别名

文档站配置了以下别名：

- `@`：指向根目录 `src`，用于引用组件库源码。
- `~`：指向项目根目录。
- `@docs`：指向 `docs/src`，用于引用文档站内部组件。

## 与组件库构建的关系

- `pnpm build` 构建组件库发布产物。
- `pnpm docs:build` 构建文档站静态产物。
- 文档站产物不属于 npm 包发布内容。

组件库发布前请回到项目根目录执行：

```bash
pnpm build
pnpm prepack:check
```
