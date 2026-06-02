import type {
  TableAction,
  TableColumn,
  TableColumnFn,
  TableProps
} from './types'
import { isFunction } from '@/utils/is'

/** 根据当前分页状态计算跨页连续序号。 */
export const setIndex = (index: number, size: number, current: number) => {
  return size * (current - 1) + index + 1
}

/** 获取列的稳定 key，优先使用显式 key，其次使用 field。 */
export function getColumnKey(column: TableColumn) {
  return column.key || column.field || ''
}

/** 解析列隐藏状态，支持静态布尔值和列级函数。 */
export function isHidden(props: TableProps, column: TableColumn) {
  if (column.hidden === undefined) {
    return false
  }
  if (isFunction(column.hidden)) {
    return column.hidden({}, null, column, props.form, props.excontext, props.editable)
  }
  return column.hidden
}

/** 判断操作按钮是否隐藏。 */
export function isHiddenAction(
  action: TableAction,
  row: Recordable,
  index: number,
  props: TableProps,
  column: TableColumn
) {
  return resolveColumnFn(action.hidden, false, row, index, column, props)
}

/** 判断操作按钮是否禁用。 */
export function isDisabledAction(
  action: TableAction,
  row: Recordable,
  index: number,
  props: TableProps,
  column: TableColumn
) {
  return resolveColumnFn(action.disabled, false, row, index, column, props)
}

/** 判断操作按钮是否显示加载态。 */
export function isLoadingAction(
  action: TableAction,
  row: Recordable,
  index: number,
  props: TableProps,
  column: TableColumn
) {
  return resolveColumnFn(action.loading, false, row, index, column, props)
}

/** 判断当前列在当前行是否进入编辑态。 */
export function isEditable(
  props: TableProps,
  column: TableColumn,
  row?: Recordable,
  index?: number
) {
  if (!props.editable) {
    return false
  }
  if (column.type === 'action') {
    return false
  }
  return resolveColumnFn(column.editable, true, row, index, column, props)
}

/** 判断编辑组件是否禁用。 */
export function isDisabled(
  props: TableProps,
  column: TableColumn,
  row: Recordable,
  index: number
) {
  return resolveColumnFn(column.editProps?.componentProps?.disabled, false, row, index, column, props)
}

/** 判断当前单元格是否展示复制入口。 */
export function isCopyable(
  props: TableProps,
  column: TableColumn,
  row: Recordable,
  index: number
) {
  return resolveColumnFn(column.copyable, false, row, index, column, props)
}

/** 判断当前单元格值是否可点击。 */
export function isClickable(
  props: TableProps,
  column: TableColumn,
  row: Recordable,
  index: number
) {
  return resolveColumnFn(column.clickable, false, row, index, column, props)
}

/** 在多级列中按 field 查找业务列定义。 */
export function findColumnByField(columns: TableColumn[], field: string) {
  const findColumn = (_columns: TableColumn[]): TableColumn | null => {
    for (const column of _columns) {
      if (column.field && column.field === field) {
        return column
      }
      if (column.children && column.children.length > 0) {
        const child = findColumn(column.children)
        if (child) return child
      }
    }
    return null
  }
  return findColumn(columns)
}

/** 在多级列中按 key 查找业务列定义。 */
export function findColumnByKey(columns: TableColumn[], key: string) {
  const findColumn = (_columns: TableColumn[]): TableColumn | null => {
    for (const column of _columns) {
      if (column.key && column.key === key) {
        return column
      }
      if (column.children && column.children.length > 0) {
        const child = findColumn(column.children)
        if (child) return child
      }
    }
    return null
  }
  return findColumn(columns)
}

/** 从展示记录中还原原始业务行，避免 selection/drag 包装字段污染事件数据。 */
export function getRawRecord(record: Recordable) {
  return record?.__abRaw || record
}

/** 统一解析列级动态配置，保证所有函数属性拿到一致上下文。 */
function resolveColumnFn<T>(
  value: TableColumnFn<T> | T | undefined,
  defaultValue: T,
  row: Recordable,
  index: number,
  column: TableColumn,
  props: TableProps
): T {
  if (value === undefined) {
    return defaultValue
  }
  if (isFunction(value)) {
    return value(row, index, column, props.form, props.excontext, props.editable)
  }
  return value as T
}
