# 更新日志

本项目遵循语义化版本风格记录变更。

## [0.0.5-beta.2] - 2026-10-28

### Fixed

- 统一 `AbTable` 编辑列静态与动态属性的浅合并和解析，`disabled`、`options`、`vBinds`、`freshKey` 使用同一份有效属性，支持完全由动态回调提供配置。
- `_v_componentProps` 改为传入真实业务行与行索引；额外绑定支持动态切换路径，业务更新监听器不会覆盖内部回写。
- 新增编辑属性 `disabledPlaceholder`，按字段最终禁用状态应用，解禁后恢复原提示；同步公开类型、文档及真实组件挂载回归。
- 禁用占位覆盖 `formItemProps.disabled` 和 `vBinds.disabled` 来源；保留显式模型属性覆盖自动绑定值的既有优先级，更新监听器独立组合。

## [0.0.5-beta.1] - 2026-10-26

### Added

- 新增 `AbAmountInput`，支持字符串金额、千分位、中文大写及真实数值编辑通知；表单和表格编辑态内置 `AmountInput`。
- 新增精确字符串金额求和 `sumAmounts`；合计回调公开 `rawData`。
- 新增表格 `amountDefaults`、金额列 `amountZeroDisplay`/`amountZeroClickable`，以及 Modal/Drawer 的 `contentStyle`/`contentLayout` 正文布局接口。
- 文档站新增 AmountInput 组件页、导航、交互与 schema 示例，补齐精确合计和正文独立滚动示例。

### Fixed

- 金额格式化及默认金额合计不再通过浮点数转换十进制字符串；金额类型列可直接使用 `render`/`formatter`。
- 分页查询事件前同步页码及每页数量，避免查询读取旧分页值。
- 切换每页条数与自动页码调整合并为一次最终查询；弹层 flex 布局保留显式正文高度。
- 金额输入零位小数只保留整数部分，科学计数回填按精度展开，避免将 `12.34` 误转为 `1234` 或将 `1e-7` 误转为 `17`。
- 修复 `AbTable` 字典列 `dot-tag` 使用 `primary` 或默认类型时蓝色圆点不可见的问题；Arco 内置颜色统一使用对应调色板变量，保留自定义 CSS 颜色和标签底色。

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
