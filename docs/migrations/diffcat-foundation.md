# DiffCat 基础能力迁移计划

日期：2026-10-26。范围：金额列、精确金额处理、分页事件、弹层正文布局、AmountInput。既有 dot-tag 修复随本次组件包交付。

## 目标与边界

将 DiffCat Vue 的底层适配移入 arco-business，业务项目保留精度、零值交互和详情布局等显式策略。保留既有公开入口及模型契约，不迁移增强表格容器、导出引擎、远程选择、上传、权限和业务接口。本轮不发布 npm、不调整正式版本、不合并或部署。

## 实施顺序

1. **精确十进制基础**：增加字符串十进制解析、舍入和求和；formatAmount 不经 Number/parseFloat 处理十进制字符串，兼容负数、指数形式、千分位、零值、空值及单位。默认金额合计使用同一精确基础。保留旧列 summaryMethod 的数值数组契约，新回调参数 rawData 提供原始行，业务代码不读取 __abRaw。
2. **金额列扩展**：增加显式 amountZeroDisplay 和 amountZeroClickable 策略；支持金额类型列的 render/formatter，而不将金额列改为 default。项目在共享表格适配层设置既有四位、千分位、零值显示和点击策略，数量列继续覆盖为两位及其单位规则。
3. **AmountInput**：迁入现有输入实现与纯函数，公开 AbAmountInput、类型和工具；注册到库内表单与表格编辑组件。保持 null/字符串空值、字符串输出、输入法、编辑中小数点、千分位、中文大写、readonly/disabled，以及真实数值编辑才触发 change 的行为。项目 AmountInput 入口改为库导出，schema 名称继续保留为 AmountInput。
4. **分页时序**：将同步页码和每页数量放在组件库的分页变更入口，先同步外部模型，再触发一次 page-change；避免重复 update 事件。项目删除 TableEasy 的手动补偿，受控父级直接从 v-model 读取新分页值。
5. **弹层正文布局**：Modal/Drawer 增加一致的 contentStyle，作用于滚动与非滚动正文容器；保留 bodyStyle/noScrollbarStyle 等已有配置及默认留白。增加可选的 contentLayout=flex，支持嵌套 Tabs 的收缩与单一正文滚动。项目详情抽屉显式设置零留白及 flex 布局，删除全局对 .ab-drawer-body__no-scrollbar 的覆盖；业务 Tabs 布局仍归项目。
6. **固定包接入**：构建与检查组件库，生成包及校验摘要；DiffCat 使用 vue/vendor 下的固定 tgz 及锁文件保证独立安装可复现，不引用开发机绝对路径。记录组件库源码提交及组件包校验信息，正式 npm 发布后由后续维护需求切回版本依赖。

## 验收

- 组件库：类型检查、构建、包内容检查；精确金额的大数/负数/舍入/零值/科学计数/求和；真实金额列的 formatter/render、零值与点击；分页事件顺序及不重复通知；AmountInput 的回填/聚焦失焦/输入法/编辑提交；弹层两种滚动模式的正文布局；既有 dot-tag 回归。
- DiffCat：AmountInput 原行为用例、金额列适配和零值策略、精确合计、数量与单位、TableEasy 分页契约；完整 Vue 类型、只读 lint 和单元测试；必要时浏览器核对代表性金额表格和多 Tab 详情。无数据库写入、迁移及菜单权限同步。
- 更新 DiffCat 适用技能、PC 呈现知识和 schemaVersion 2 变更记录；按项目流程提交、校验并创建 PR。独立审查未完成时标注待独立审查。

## 回退与完成标准

固定包与调用方迁移作为一个变更集回退；不单独回退依赖而保留新 API。完成意味着五项实现已落地、原有项目重复实现/补偿已移除、必要验证有实际记录，且发布及人工审查事项被清楚列出。不能用仅完成库侧开发替代业务项目迁移。

## 执行记录

- 已完成前期源码审计；维护者选择先使用仓库内固定组件包。
- 五项代码及业务调用方替换已完成；44 个详情抽屉改用公开布局接口。
- 库侧类型检查、构建、包内容检查、foundation 回归及 24 个 dot-tag 用例已通过。业务侧完整 Vue 类型、只读 lint、215 个文件的 1143 个测试及生产构建均已通过；lint 为 0 错误、13 条既有警告。
- Chrome 真实组件验收通过：金额真实编辑通知、精确金额与零值点击、蓝色圆点、分页事件顺序、Modal 两种滚动模式正文 padding、长正文抽屉独立滚动及底部操作可见，无 pageerror。
- 库侧 ESLint 仍报告原有 Table.vue 的组件名 Table 为 HTML 保留名称；该行未改动，本次不改变组件实例名称。TSX 不在现有 ESLint 配置匹配范围，使用类型检查及构建验证；新增运行代码其余 lint 检查通过。
- 固定组件包及来源补丁由 DiffCat PR #158 交付；独立审查确认并修复空金额占位、数量导出和金额输入边界问题，复审无剩余可复现发现。合并与正式发布由维护者决定。
- 补验修正：flex 布局保留 scrollbarHeight 和历史 noScrollbarStyle 的显式高度，contentStyle 仍具有最高优先级；每页条数变化与 Arco 自动调整页码合并为一次最终查询。Chrome 已验证 200px 滚动高度、123px 历史高度、175px 显式覆盖、默认 12px/10px 留白，以及条数 10→50、页码 2→1 只查询一次。

## 0.0.5-beta.1 发布准备

维护者在迁移及独立审查完成后要求准备此预发布版本。package.json、src/version.ts 和 CHANGELOG 同步为 0.0.5-beta.1，README 组件目录补齐 AbAmountInput。文档站新增 AmountInput 页面、导航及表单/表格接入示例，补齐金额、原始行合计与弹层正文布局示例和 API。

验证：组件库完整构建及类型检查、foundation/dot-tag 回归、包内容检查、打包预览和文档站构建通过。Chrome 验证新页面导航、金额输入/change、表单及表格回写、源码预览、精确合计、Modal/Drawer 独立滚动与底部操作，无 pageerror。

最后提交使用 `chore(publish): 发布 0.0.5-beta.1 版本`。现有 npm 与 Pages 工作流仅在 main/master 推送或手动触发时运行，beta 版本发布到 npm 的 beta 标签。发布是否成功以工作流和 npm 结果为准，不能用本地构建代替。howcat-master 保持仓库内固定包，等待维护者确认 npm 成功发布后再切换版本依赖。
