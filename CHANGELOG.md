# 更新日志

本项目遵循语义化版本风格记录变更。

## [0.0.1] - 2026-06-02

### Added

- 新增基于 Vue 3 和 Arco Design Vue 的组件库基础结构。
- 新增 `AbForm` 表单引擎，支持 Schema 配置、动态属性、自动校验、布局控制和自定义组件注册。
- 新增 `AbTable` 表格组件，支持业务列配置、操作列、选择、展开、合计和可编辑表格场景。
- 新增 `AbIcon` 图标组件，支持 Iconify 图标和自定义图标集注册。
- 新增 `AbUpload` 上传组件，统一文件字段映射、文件列表和上传交互。
- 新增 `AbModal` 和 `AbDrawer` 业务容器组件。
- 新增 `AbText` 增强文本组件，支持状态、点标记、高亮、格式化和脱敏展示。
- 新增 `AbComboInput` 组合输入器组件。
- 新增 `zh-CN`、`en-US` 语言包，以及安装时配置、运行时切换和自定义语言包覆盖能力。
- 新增字典、格式化、树查询、自动校验规则等业务工具函数。
- 新增独立 Vite 文档站，覆盖指南、组件示例、API 表格和源码预览。

### Changed

- 组件库从原 Element Plus 版本逐步迁移为 Arco Design Vue 版本。
- 发布产物调整为 `dist/index.js`、`dist/index.cjs`、`dist/index.d.ts` 和 `dist/style.css`。

### Notes

- 当前版本仍处于早期迁移阶段，组件 API 会继续围绕 Arco Design Vue 适配和文档完善进行迭代。
