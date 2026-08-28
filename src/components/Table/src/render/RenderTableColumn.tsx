import type {
  TableColumn,
  TableEmits,
  TableFormComponentName,
  TableProps,
  TableSlotDefault,
  TableSlots
} from '../types'
import type { TableColumnData } from '@arco-design/web-vue'
import type { TableFormImportItemConfig } from '@/types/imports'
import TooltipHeader from '../components/TooltipHeader.vue'
import { getSlot } from '@/utils/get'
import {
  getColumnKey,
  getRawRecord,
  isEditable,
  isHidden,
  setIndex,
  shouldUseIndexOperation
} from '../utils'
import type { Component, Ref } from 'vue'
import type { UseDictTools } from '@/utils/dict'
import { get } from 'lodash-es'
import {
  renderAmountColumn,
  renderDateColumn,
  renderDictColumn,
  renderImageTextColumn,
  renderSensitiveColumn,
  wrapValueWithFeatures,
  type RenderContext
} from './columnRenderers'
import { renderActionColumn } from './actionRenderer'
import { renderEditableColumn } from './editableRenderer'
import { logger } from '@/locale'
import { t } from '@/locale'

/** 将 TableColumn 递归转换为 Arco TableColumnData。 */
export function renderTableColumns(
  props: TableProps,
  slots: TableSlots,
  emit: TableEmits,
  pageSizeRef: Ref<number>,
  pageRef: Ref<number>,
  dictTools: UseDictTools,
  components: Partial<Recordable<Component, TableFormComponentName>>,
  componentConfigs: Partial<Recordable<TableFormImportItemConfig, TableFormComponentName>>
) {
  const validColumns = getValidColumns(props, props.columns || [])
  const columns: TableColumnData[] = []

  if (props.indexable && !shouldUseIndexOperation(props)) {
    columns.push(renderIndexColumn(props, pageSizeRef, pageRef))
  }

  columns.push(...validColumns.map(column => renderTableColumn(column)))

  return columns

  /** 构建跨页递增的序号列。 */
  function renderIndexColumn(
    props: TableProps,
    pageSizeRef: Ref<number>,
    pageRef: Ref<number>
  ): TableColumnData {
    const config = typeof props.indexable === 'object' ? props.indexable : {}
    return {
      dataIndex: '__abIndex',
      title: config.label ?? t('table.index'),
      width: config.width ?? 70,
      minWidth: config.minWidth ?? 70,
      fixed: config.fixed ?? 'left',
      align: config.align ?? 'center',
      render: ({ record, rowIndex }) => {
        const rawRow = getRawRecord(record)
        if (rawRow?.__abSummary) {
          return rawRow.__abIndex || props.emptyValue
        }
        return setIndex(rowIndex, pageSizeRef.value || 10, pageRef.value || 1)
      }
    }
  }

  /** 构建普通列或多级表头列。 */
  function renderTableColumn(column: TableColumn): TableColumnData {
    const columnKey = getColumnKey(column)
    if (!columnKey) {
      logger.warn('console.table.columnMissingKey', { label: column.label || '' }, column)
    }

    if (column.children && column.children.length > 0) {
      const validChildColumns = getValidColumns(props, column.children)
      return {
        align: column.align || props.align || 'center',
        title: () => renderHeader(column, columnKey),
        children: validChildColumns.map(child => renderTableColumn(child)),
        ...(column.columnAttrs || {})
      }
    }

    const ellipsis = column.ellipsis ?? props.ellipsis ?? false
    const tooltip = column.tooltip ?? ellipsis
    const columnAttrs: TableColumnData = {
      dataIndex: column.field || column.key || '',
      title: () => renderHeader(column, columnKey),
      align: column.align || props.align || 'center',
      fixed: column.fixed,
      width: column.width,
      minWidth: column.minWidth,
      ellipsis,
      tooltip,
      render: ({ record, column: arcoColumn, rowIndex }) => {
        const rawRow = getRawRecord(record)
        if (rawRow?.__abSummary) {
          return renderSummaryCell(column, rawRow)
        }
        return (
          getSlot(slots, column.field || column.key || '', createSlotData(rawRow, arcoColumn, rowIndex)) ||
          renderTableColumnDefault(column, rawRow, rowIndex)
        )
      },
      ...(column.columnAttrs || {})
    }

    if (isEditable(props, column, {}, null)) {
      columnAttrs.bodyCellClass = mergeCellClass(columnAttrs.bodyCellClass, 'ab-table-column-editable')
    } else {
      columnAttrs.bodyCellClass = mergeCellClass(columnAttrs.bodyCellClass, 'ab-table-column')
    }

    return columnAttrs
  }

  /** 渲染表头，优先级为插槽、headerRender、默认 TooltipHeader。 */
  function renderHeader(column: TableColumn, columnKey: string) {
    return (
      getSlot(slots, `${columnKey}--header`) ||
      getSlot(slots, `${columnKey}-header`) ||
      column.headerRender?.({}, null, column, props.form, props.excontext, props.editable) || (
        <TooltipHeader title={column.label} subLabel={column.subLabel} />
      )
    )
  }

  /** 构建列插槽入参，保持与旧自建渲染引擎一致的 $index。 */
  function createSlotData(
    row: Recordable,
    column: TableColumnData,
    rowIndex: number
  ): TableSlotDefault {
    return {
      row,
      column,
      rowIndex,
      $index: rowIndex
    }
  }

  /** 根据编辑态决定渲染编辑组件或展示态内容。 */
  function renderTableColumnDefault(column: TableColumn, row: Recordable, index: number) {
    if (isEditable(props, column, row, index)) {
      return renderEditableColumn({
        props,
        slots,
        emit,
        column,
        row,
        index,
        components,
        componentConfigs
      })
    }

    return renderDisplayColumn(column, row, index)
  }

  /** 渲染合计单元格，只读取 summary 数据，不进入编辑态或业务渲染器。 */
  function renderSummaryCell(column: TableColumn, row: Recordable) {
    const dataIndex = column.field || column.key || ''
    if (!dataIndex) {
      return props.emptyValue
    }
    return get(row, dataIndex) ?? props.emptyValue
  }

  /** 执行业务类型、formatter、render 与空值逻辑。 */
  function renderDisplayColumn(column: TableColumn, row: Recordable, index: number) {
    const emptyValue = column.emptyValue || props.emptyValue || ''
    const value = column.field ? get(row, column.field) : ''
    const originValue = value
    const ctx: RenderContext = {
      props,
      column,
      row,
      index,
      value,
      originValue,
      emptyValue,
      dictTools,
      emit
    }

    if (column.type === 'default' || !column.type) {
      if (column.render !== undefined) {
        return column.render(row, index, column, props.form, props.excontext, props.editable)
      }

      if (column.formatter !== undefined) {
        const formattedValue = column.formatter(
          row,
          index,
          column,
          props.form,
          props.excontext,
          props.editable
        )
        return wrapValueWithFeatures(ctx, { value: formattedValue as any })
      }

      return wrapValueWithFeatures(ctx, { value: value ?? emptyValue })
    }

    const result = renderByType(ctx)
    return wrapValueWithFeatures(ctx, result)
  }

  /** 按 column.type 分派到内置业务渲染器。 */
  function renderByType(ctx: RenderContext) {
    const { column, emptyValue } = ctx

    switch (column.type) {
      case 'dict':
        return renderDictColumn(ctx)
      case 'amount':
        return renderAmountColumn(ctx)
      case 'date':
        return renderDateColumn(ctx)
      case 'sensitive':
        return renderSensitiveColumn(ctx)
      case 'image-text':
        return renderImageTextColumn(ctx)
      case 'action':
        return renderActionColumn({
          props: ctx.props,
          column: ctx.column,
          row: ctx.row,
          index: ctx.index,
          emit: ctx.emit
        })
      default:
        logger.warn('console.table.unknownColumnType', { type: column.type }, column)
        return { value: emptyValue }
    }
  }
}

/** 过滤被 visible/hidden 排除的列。 */
function getValidColumns(props: TableProps, columns: TableColumn[]) {
  return columns.filter(column => {
    const visible = column.visible === undefined ? true : column.visible
    return visible ? !isHidden(props, column) : false
  })
}

/** 合并 Arco bodyCellClass，兼容函数和静态 class。 */
function mergeCellClass(origin: any, extra: string) {
  if (!origin) {
    return extra
  }
  if (typeof origin === 'function') {
    return (record: Recordable) => [origin(record), extra]
  }
  return [origin, extra]
}
