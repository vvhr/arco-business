import type { PropType } from 'vue'
import type { DictMap } from '@/types/dict'
import type { TableFormImportItem } from '@/types/imports'
import type {
  TableColumn,
  TableColumnExpand,
  TablePagination,
  TableProps
} from './types'
import {
  DEFAULT_EMPTY_VALUE,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_ROW_KEY
} from './constants'

type TableRuntimePropKey = keyof Pick<
  TableProps,
  | 'modelValue'
  | 'columns'
  | 'form'
  | 'excontext'
  | 'dict'
  | 'editable'
  | 'page'
  | 'pageSize'
  | 'ellipsis'
  | 'total'
  | 'pagination'
  | 'loading'
  | 'align'
  | 'size'
  | 'rowKey'
  | 'emptyValue'
  | 'adaptive'
  | 'scroll'
  | 'showSummary'
  | 'summaryMethod'
  | 'summarySpanMethod'
  | 'freshKey'
  | 'imports'
  | 'indexable'
  | 'selectable'
  | 'expandable'
  | 'draggable'
>

type TableRuntimeProps = Record<TableRuntimePropKey, any> &
  Partial<Record<keyof TableProps, any>>

/**
 * Table 的 Vue runtime props 定义。
 *
 * 该对象只维护本组件自有属性，Arco Table 原生属性通过 attrs 透传；
 * key 使用 TableProps 约束，避免组件实现与公开类型出现字段拼写漂移。
 */
export const tableProps = {
  modelValue: {
    type: Array as PropType<TableProps['modelValue']>,
    default: () => []
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  form: {
    type: Object as PropType<TableProps['form']>,
    default: () => ({})
  },
  excontext: {
    type: Object as PropType<TableProps['excontext']>,
    default: () => ({})
  },
  dict: {
    type: Object as PropType<DictMap>,
    default: () => ({})
  },
  editable: {
    type: Boolean,
    default: false
  },
  page: {
    type: Number,
    default: DEFAULT_PAGE_INDEX
  },
  pageSize: {
    type: Number,
    default: DEFAULT_PAGE_SIZE
  },
  ellipsis: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },
  pagination: {
    type: [Object, Boolean] as PropType<TablePagination | false | null | undefined>,
    default: (): TablePagination | undefined => undefined
  },
  loading: {
    type: [Boolean, Object] as PropType<TableProps['loading']>,
    default: false
  },
  align: {
    type: String as PropType<TableProps['align']>,
    default: 'left'
  },
  size: {
    type: String as PropType<TableProps['size']>,
    default: 'medium'
  },
  rowKey: {
    type: String,
    default: DEFAULT_ROW_KEY
  },
  emptyValue: {
    type: String,
    default: DEFAULT_EMPTY_VALUE
  },
  adaptive: {
    type: Boolean,
    default: false
  },
  scroll: {
    type: Object as PropType<TableProps['scroll']>,
    default: undefined
  },
  showSummary: {
    type: Boolean,
    default: false
  },
  summaryMethod: {
    type: Function as PropType<TableProps['summaryMethod']>,
    default: null
  },
  summarySpanMethod: {
    type: Function as PropType<TableProps['summarySpanMethod']>,
    default: undefined
  },
  freshKey: {
    type: Number,
    default: 0
  },
  imports: {
    type: Array as PropType<TableFormImportItem[]>,
    default: () => []
  },
  indexable: {
    type: null as unknown as PropType<TableProps['indexable']>,
    default: false
  },
  selectable: {
    type: null as unknown as PropType<TableProps['selectable']>,
    default: false
  },
  expandable: {
    type: Object as PropType<TableColumnExpand>,
    default: undefined
  },
  draggable: {
    type: null as unknown as PropType<TableProps['draggable']>,
    default: false
  }
} satisfies TableRuntimeProps
