import type {
  ButtonProps,
  FieldRule,
  PaginationProps,
  TableChangeExtra as ArcoTableChangeExtra,
  TableColumnData,
  TableData,
  TableDraggable,
  TableExpandable,
  TableRowSelection
} from '@arco-design/web-vue'
import type { Component, CSSProperties, Slots, VNodeChild } from 'vue'
import type { DictItem, DictMap } from '@/types/dict'
import type { TableFormImportItem } from '@/types/imports'

type ArcoTablePublicProps = InstanceType<typeof import('@arco-design/web-vue')['Table']>['$props']

/** Table 继承 Arco Table 后保留的尺寸枚举。 */
export type TableSize = 'mini' | 'small' | 'medium' | 'large'

/** Table 支持的插槽集合，普通列插槽使用 field/key 命名，表头插槽追加 --header。 */
export interface TableSlots extends Slots {
  [key: string]: (data?: TableSlotDefault) => any
  [key: `${string}--header`]: () => any
  /** 展开行内容插槽，对应顶层 expandable 配置。 */
  expand: (data: TableSlotDefault) => any
}

/** Table 对外派发的事件签名。 */
export interface TableEmits {
  (e: 'update:modelValue', value: Recordable[]): void
  (e: 'update:editable', value: boolean): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:page', value: number): void
  (e: 'register', tableRef: TableRawInstance | undefined): void
  (e: 'selection-change', value: Recordable[]): void
  (e: 'page-change', value: { page: number; pageSize: number }): void
  (e: 'current-change', currentRow: Recordable): void
  (e: 'row-click', row: Recordable): void
  (e: 'value-click', key: string, row: Recordable): void
  (e: 'action', event: { name: string; row: Recordable; index: number }): void
  (e: 'drag-change', value: Recordable[]): void
}

/**
 * Table 组件属性。
 *
 * 默认继承 Arco Table 的公开属性，但排除了会被 Table 自身接管的滚动、
 * 分页、展开、选择、拖拽、合计等配置。被排除的能力统一通过 Table 自有属性转换。
 */
export interface TableProps
  extends Omit<
    Partial<ArcoTablePublicProps>,
    | 'data'
    | 'columns'
    | 'scroll'
    | 'pagination'
    | 'pagePosition'
    | 'page-position'
    | 'virtualListProps'
    | 'virtual-list-props'
    | 'filterIconAlignLeft'
    | 'filter-icon-align-left'
    | 'scrollbar'
    | 'summary'
    | 'summarySpanMethod'
    | 'summary-span-method'
    | 'rowSelection'
    | 'row-selection'
    | 'expandable'
    | 'draggable'
    | 'size'
  > {
  /** 表格数据，内部会透传给 Arco Table 的 data。 */
  modelValue: Recordable[]
  /** 业务列定义，内部转换为 Arco TableColumnData。 */
  columns: TableColumn[]
  /** 编辑态和函数式列渲染共享的外部表单模型。 */
  form: Recordable
  /** 传给列函数的额外上下文。 */
  excontext: Recordable
  /** 字典渲染可用的字典集合。 */
  dict: DictMap
  /** 是否启用单元格编辑态。 */
  editable: boolean
  /** 当前页码，配合独立分页器使用。 */
  page: number
  /** 每页条数，序号列会按该值计算跨页序号。 */
  pageSize: number
  /** 总条数，默认写入独立分页器。 */
  total?: number
  /** 全局单元格省略配置，可被列级 ellipsis 覆盖。 */
  ellipsis: boolean
  /** 独立 Arco Pagination 配置；false/null 时不渲染分页器。 */
  pagination: TablePagination | undefined | false | null
  /** 表格加载态，兼容 Arco Table 的 loading 形态。 */
  loading: boolean | Record<string, any>
  /** 默认列对齐方式。 */
  align: 'left' | 'center' | 'right'
  /** Arco Table 尺寸。 */
  size: TableSize
  /** 行主键字段，用于选择、展开和拖拽后定位原始行。 */
  rowKey: string
  /** 空值展示文本。 */
  emptyValue: string
  /** 是否启用父级高度自适应。 */
  adaptive: boolean
  /** 是否显示合计行，内部转换为 Arco Table 的 summary。 */
  showSummary: boolean
  /** 自定义 Arco summary 数据生成函数。 */
  summaryMethod: ((param: TableSummaryParams) => TableData[]) | null
  /** Arco summary 单元格合并函数。 */
  summarySpanMethod?: (data: TableSummarySpanParams) => { rowspan?: number; colspan?: number } | void
  /** 强制刷新 table 的 key。 */
  freshKey: number
  /** 编辑组件局部注册配置。 */
  imports: TableFormImportItem[]
  /** 顶层序号列配置；true 使用默认序号列。 */
  indexable?: boolean | TableColumnIndex
  /** 顶层选择列配置；true 使用默认 checkbox 选择列。 */
  selectable?: boolean | TableColumnSelect
  /** 顶层展开列配置。 */
  expandable?: TableColumnExpand
  /** 顶层拖拽列配置；true 使用默认拖拽手柄。 */
  draggable?: boolean | TableColumnDraggable
}

/** 传给自定义合计函数的数据结构。 */
export type TableSummaryParams = {
  /** 已转换完成的 Arco 列定义。 */
  columns: TableColumnData[]
  /** 当前参与渲染的表格数据。 */
  data: TableData[]
}

/** 合计行单元格合并函数入参。 */
export type TableSummarySpanParams = {
  record: TableData
  column: TableColumnData
  rowIndex: number
  columnIndex: number
}

/** 独立分页器配置，current/pageSize/total 由 Table 统一接管。 */
export type TablePagination = Omit<
  PaginationProps,
  'current' | 'defaultCurrent' | 'pageSize' | 'defaultPageSize' | 'total'
> & {
  /** 分页总条数，未传时使用 TableProps.total。 */
  total?: number
}

/** Table 实例暴露方法。 */
export interface TableExpose {
  /** 按原始行对象更新选中态。 */
  updateSelections: (rows: Recordable[]) => void
  /** 按 rowKey 主键数组更新选中态，适用于接口只返回默认选中主键的场景。 */
  updateSelectionKeys: (keys: (string | number)[]) => void
  /** 校验编辑态表格，非编辑态直接返回 true。 */
  validate: () => Promise<boolean>
  /** 清空 Arco Form 的校验状态。 */
  resetValidate: () => void
}

/** 列级函数统一签名，所有动态列属性均使用相同上下文。 */
export type TableColumnFn<T> = (
  row: Recordable,
  index: number,
  column: TableColumn,
  form: Recordable,
  excontext: Recordable,
  editable: boolean
) => T

/** 兼容消费端 TSX 生成的 VNode，避免绑定到组件库自身的 @vue/runtime-core 实例。 */
export interface TableVNodeLike {
  type: any
  props?: any
  children?: any
  key?: any
  el?: any
}

/** Table 渲染回调允许返回的节点内容。 */
export type TableRenderNode = VNodeChild | TableVNodeLike | TableVNodeLike[]

/** Table 内置业务渲染类型；结构列已迁移到顶层 props。 */
export type TableColumnType =
  | 'default'
  | 'action'
  | 'dict'
  | 'date'
  | 'amount'
  | 'sensitive'

/** 不同业务列类型的附加配置。 */
export type TableColumnTypeProps = {
  /** 操作列按钮集合或动态按钮函数。 */
  actions?: TableColumnFn<TableAction[]> | TableAction[]
  /** 操作列更多按钮的展示配置。 */
  actionDropdown?: {
    noIcon?: boolean
    noLabel?: boolean
    icon?: string
    iconSize?: number
    size?: ButtonProps['size']
    buttonAttrs?: ButtonProps & Recordable
  }
  /** 字典名称，配合全局或局部 dict 数据查找。 */
  dictName?: string
  /** 直接传入的字典选项，优先级高于 dictName。 */
  dictOptions?: DictItem[]
  /** 字典数据是否为树形结构。 */
  dictIsTree?: boolean
  /** 树形字典值是否为路径数组。 */
  dictValueIsPath?: boolean
  /** 树形字典是否展示完整路径标签。 */
  dictLabelFullpath?: boolean
  /** 树形字典路径标签分隔符。 */
  dictLabelSeparator?: string
  /** 字典展示方式。 */
  dictViewType?: 'tag' | 'text' | 'dot-tag'
  /** 自定义字典展示渲染函数。 */
  dictViewRender?: (originValue: any, value: any, option: any) => TableRenderNode
  /** 日期格式化模板。 */
  dateFormat?: string
  /** 金额是否显示千分位。 */
  amountThousand?: boolean
  /** 金额是否保留小数。 */
  amountDecimal?: boolean
  /** 金额小数位数。 */
  amountDigits?: number
  /** 金额单位。 */
  amountUnit?: string
  /** 金额单位位置。 */
  amountUnitPosition?: 'left' | 'right'
  /** 内置脱敏类型。 */
  sensitiveType?: 'phone' | 'idCard' | 'email'
  /** 自定义脱敏正则与替换模板。 */
  sensitiveRegex?: [RegExp | string, string]
  /** 是否允许悬停/聚焦时查看原始值。 */
  sensitiveHover?: boolean
  [key: string]: any
}

/** Table 业务列定义。 */
export interface TableColumn {
  /** 数据字段路径，内部会映射为 Arco 的 dataIndex。 */
  field?: string
  /** 列唯一 key，适合无 field 的操作列或分组列。 */
  key?: string
  /** 列标题，内部会映射为 Arco 的 title。 */
  label?: string
  /** 表头副标题，默认使用 TooltipHeader 展示。 */
  subLabel?: string
  /** 列级空值展示文本。 */
  emptyValue?: string
  /** 自定义表头渲染函数。 */
  headerRender?: TableColumnFn<TableRenderNode>
  /** 动态隐藏函数或静态隐藏标记。 */
  hidden?: TableColumnFn<boolean> | boolean
  /** 静态显隐开关，false 时不参与列渲染。 */
  visible?: boolean
  /** 子列定义，用于多级表头。 */
  children?: TableColumn[]
  /** 列宽。 */
  width?: number
  /** 最小列宽。 */
  minWidth?: number
  /** 固定列方向。 */
  fixed?: 'left' | 'right'
  /** 业务渲染类型。 */
  type?: TableColumnType
  /** 业务渲染类型附加配置。 */
  typeProps?: TableColumnTypeProps
  /** 列对齐方式。 */
  align?: 'left' | 'center' | 'right'
  /** 兼容旧渲染引擎的格式化函数，不依赖 Arco column formatter。 */
  formatter?: TableColumnFn<TableRenderNode>
  /** 自定义单元格渲染函数。 */
  render?: TableColumnFn<TableRenderNode>
  /** 是否开启单元格省略。 */
  ellipsis?: boolean
  /** 是否开启 Arco tooltip；默认跟随 ellipsis。 */
  tooltip?: boolean | Record<string, any>
  /** 是否展示复制按钮。 */
  copyable?: TableColumnFn<boolean> | boolean
  /** 自定义复制值。 */
  copyValueMethod?: TableColumnFn<string>
  /** 是否允许点击单元格值。 */
  clickable?: TableColumnFn<boolean> | boolean
  /** 点击单元格值后的回调。 */
  clickMethod?: TableColumnFn<void>
  /** 是否参与导出，保留给外部导出能力使用。 */
  exportable?: boolean
  /** 自定义导出值。 */
  exportValueMethod?: TableColumnFn<string | number>
  /** Arco TableColumnData 透传属性，受 Table 接管的字段已排除。 */
  columnAttrs?: Omit<
    TableColumnData,
    'dataIndex' | 'title' | 'sortable' | 'filterable' | 'index' | 'render' | 'children'
  > &
    Recordable
  /** 是否进入编辑态。 */
  editable?: TableColumnFn<boolean> | boolean
  /** 编辑组件配置。 */
  editProps?: TableColumnEditProps
  /** 默认合计逻辑是否统计该列。 */
  summable?: boolean
  /** 列级合计函数。 */
  summaryMethod?: (values: any[]) => TableRenderNode
  [key: string]: any
}

/** 顶层序号列配置。 */
export interface TableColumnIndex {
  label?: string
  width?: number
  minWidth?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
}

/** 顶层选择列配置，会转换为 Arco rowSelection。 */
export interface TableColumnSelect extends Omit<TableRowSelection, 'title' | 'width'> {
  width?: number
  /** 返回 false 时禁用当前行选择。 */
  selectable?: TableColumnFn<boolean>
}

/** 顶层展开列配置，会转换为 Arco expandable.expandedRowRender。 */
export interface TableColumnExpand
  extends Omit<TableExpandable, 'title' | 'width' | 'expandedRowRender'> {
  label?: string
  width?: number
  /** 自定义展开行渲染；未传时使用 expand 插槽。 */
  render?: (record: Recordable) => VNodeChild
}

/** 顶层拖拽列配置，会转换为 Arco draggable。 */
export interface TableColumnDraggable extends Omit<TableDraggable, 'title' | 'width'> {
  label?: string
  width?: number
}

/** 编辑态支持的默认 Arco 组件名称。 */
export type TableFormComponentName =
  | 'AutoComplete'
  | 'Cascader'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'Input'
  | 'InputNumber'
  | 'InputTag'
  | 'Mention'
  | 'RangePicker'
  | 'RadioGroup'
  | 'Select'
  | 'Slider'
  | 'Switch'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'

/** 单元格编辑配置。 */
export interface TableColumnEditProps {
  /** 编辑字段路径，默认使用 column.field。 */
  field?: string
  /** 编辑组件名称，默认 Input。 */
  component?: TableFormComponentName | string
  /** 默认值，保留给外部初始化逻辑使用。 */
  defaultValue?: any
  /** 传给编辑组件的属性。 */
  componentProps?: TableFormComponentProps
  /** 动态组件属性函数。 */
  _v_componentProps?: TableColumnFn<Recordable>
  /** 编辑组件事件映射。 */
  componentEvent?: TableFormComponentEvents
  /** Arco FormItem 属性。 */
  formItemProps?: {
    rules?: FieldRule | FieldRule[]
    autoRules?: TableFormAutoRules[]
  } & Recordable
  /** 编辑组件内部插槽配置。 */
  insideProps?: {
    renders?: TableFormInsidePropsRenders
  }
}

/** 编辑组件属性扩展。 */
export interface TableFormComponentProps {
  freshKey?: string | number
  disabled?: TableColumnFn<boolean> | boolean
  allowClear?: boolean
  options?: TableColumnFn<any[]> | any[]
  fieldNames?: TableOptionKeys
  style?: CSSProperties | string
  placeholder?: string | string[]
  /** 额外双向绑定字段映射。 */
  vBinds?: Recordable<string, string>
  [key: string]: any
}

/** 操作列按钮配置。 */
export interface TableAction {
  label: string
  noLabel?: boolean
  name: string
  icon?: string
  noIcon?: boolean
  type?: ButtonProps['type']
  /** 按钮是否进入更多菜单。 */
  dropdown?: 'always' | 'auto' | 'never'
  /** 点击按钮后的业务回调。 */
  event?: TableColumnFn<void>
  loading?: TableColumnFn<boolean> | false
  disabled?: TableColumnFn<boolean> | boolean
  hidden?: TableColumnFn<boolean> | boolean
  buttonAttrs?: ButtonProps & Recordable
}

/** 单元格默认插槽入参。 */
export type TableSlotDefault = {
  row: Recordable
  column: TableColumnData
  rowIndex: number
  $index: number
}

/** 编辑组件事件函数签名。 */
export type TableFormComponentEventFn<T> = (
  event: T,
  row: Recordable,
  index: number,
  column: TableColumn,
  form: Recordable,
  excontext: Recordable
) => void

/** 编辑组件事件集合，key 使用 Vue onXxx 事件名。 */
export interface TableFormComponentEvents {
  onChange?: TableFormComponentEventFn<any>
  onClear?: TableFormComponentEventFn<void>
  onBlur?: TableFormComponentEventFn<FocusEvent>
  onFocus?: TableFormComponentEventFn<FocusEvent>
  [key: string]: TableFormComponentEventFn<any>
}

/** 编辑组件内部插槽渲染集合。 */
export type TableFormInsidePropsRenders = Recordable<TableFormInsidePropsRender>

/** 编辑组件内部插槽单项渲染配置。 */
export type TableFormInsidePropsRender =
  | TableColumnFn<TableRenderNode | false>
  | false
  | string

/** 表单自动校验规则名称。 */
export type TableFormAutoRules =
  | 'isRequired'
  | 'isRequiredArray'
  | 'noSpace'
  | 'normalText'
  | 'isIdCard'
  | 'isMobilePhone'
  | 'isTelephone'
  | 'noChinese'
  | 'isCreditCode'
  | 'onlyNumber'
  | 'onlyLetter'
  | 'isEmail'

/** Arco 选项字段映射。 */
export type TableOptionKeys = {
  label?: string
  value?: string
  children?: string
  disabled?: string
}

/** Arco Table 原始实例能力的最小暴露类型。 */
export type TableRawInstance = {
  select?: (rowKey: string | number | (string | number)[], checked?: boolean) => void
  selectAll?: (checked?: boolean) => void
  expand?: (rowKey: string | number | (string | number)[], checked?: boolean) => void
  expandAll?: (checked?: boolean) => void
  resetFilters?: (dataIndex?: string | string[]) => void
  clearFilters?: (dataIndex?: string | string[]) => void
  resetSorters?: () => void
  clearSorters?: () => void
}

/** Arco Table change extra 类型别名。 */
export type TableChangeExtra = ArcoTableChangeExtra
