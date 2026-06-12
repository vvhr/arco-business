import { Button, Form, Table } from '@arco-design/web-vue'
import type {
  TableColumn,
  TableEmits,
  TableFormComponentName,
  TableProps,
  TableRawInstance,
  TableSlots
} from '../types'
import type {
  TableColumnData,
  TableData,
  TableDraggable,
  TableExpandable,
  TableRowSelection
} from '@arco-design/web-vue'
import type { TableComponents, TableOperationColumn } from '@arco-design/web-vue/es/table/interface'
import type { TableFormImportItemConfig } from '@/types/imports'
import { computed, unref, type Component, type Ref } from 'vue'
import { renderTableColumns } from './RenderTableColumn'
import type { UseDictTools } from '@/utils/dict'
import {
  findColumnByField,
  findColumnByKey,
  getRawRecord,
  getVisibleTreeRows,
  setIndex,
  shouldUseIndexOperation
} from '../utils'
import { formatAmount } from '@/utils/format'
import { getSlot } from '@/utils/get'
import { t } from '@/locale'

/** 渲染 Table 主体，并在编辑态下包裹 Arco Form。 */
export function renderTable(
  props: TableProps,
  slots: TableSlots,
  emit: TableEmits,
  pageSizeRef: Ref<number>,
  pageRef: Ref<number>,
  tableRef: Ref<TableRawInstance | undefined>,
  formRef: Ref<any>,
  tableAttrs: Ref<Recordable>,
  selectedKeys: Ref<(string | number)[]>,
  expandedKeys: Ref<(string | number)[]>,
  tableData: Ref<TableData[]>,
  dictTools: UseDictTools,
  components: Partial<Recordable<Component, TableFormComponentName>>,
  componentConfigs: Partial<Recordable<TableFormImportItemConfig, TableFormComponentName>>
) {
  const columns = computed(() =>
    renderTableColumns(
      props,
      slots,
      emit,
      pageSizeRef,
      pageRef,
      dictTools,
      components,
      componentConfigs
    )
  )

  const rowSelection = computed(() => buildRowSelection(props))
  const expandable = computed(() => buildExpandable(props, slots))
  const draggable = computed(() => buildDraggable(props))
  const summary = computed(() => buildSummary(props))

  const clearSelection = () => {
    selectedKeys.value = []
    emit('selection-change', [])
  }

  /** 在选择列启用且存在选中行时追加选择统计，不覆盖用户 footer 插槽。 */
  const renderSelectedFooter = () => {
    if (selectedKeys.value.length <= 0) {
      return getSlot(slots, 'footer') || undefined
    }
    const selectedText = t('table.selection.selected')
    const itemsText = t('table.selection.items')
    const clearText = t('table.selection.clear')
    return (
      <>
        {getSlot(slots, 'footer')}
        <div class="ab-table-append-selection">
          <span>
            {selectedText} <span class="total">{selectedKeys.value.length}</span> {itemsText}
          </span>
          <Button type="secondary" size="medium" onClick={clearSelection}>
            {clearText}
          </Button>
        </div>
      </>
    )
  }

  /** 组装最终传给 Arco Table 的属性和事件桥接。 */
  const renderArcoTable = () => {
    const tableClass = `ab-table-main ${selectedKeys.value.length > 0 ? 'has-append' : ''}`
    const attrs = unref(tableAttrs)
    const tableProps = {
      ref: tableRef,
      key: props.freshKey,
      data: tableData.value,
      columns: columns.value,
      pagination: false,
      rowKey: props.rowKey,
      loading: props.loading,
      size: props.size,
      class: tableClass,
      rowSelection: rowSelection.value,
      expandable: expandable.value,
      draggable: draggable.value,
      selectedKeys: selectedKeys.value,
      summary: summary.value,
      summarySpanMethod: props.summarySpanMethod,
      scroll: buildScroll(props),
      ...attrs,
      components: buildComponents(props, attrs, pageSizeRef, pageRef, expandedKeys),
      'onUpdate:selectedKeys': (keys: (string | number)[]) => {
        selectedKeys.value = keys
      },
      onSelectionChange: (keys: (string | number)[]) => {
        selectedKeys.value = keys
        emit('selection-change', getRowsByKeys(props.modelValue, props.rowKey, keys))
      },
      onRowClick: (record: Recordable) => {
        const raw = getRawRecord(record)
        emit('current-change', raw)
        emit('row-click', raw)
      },
      onChange: (data: Recordable[], extra: any) => {
        if (extra?.type === 'drag') {
          const nextData = data.map(item => getRawRecord(item))
          emit('update:modelValue', nextData)
          emit('drag-change', nextData)
        }
      },
      onExpandedChange: (keys: (string | number)[]) => {
        expandedKeys.value = keys
        attrs.onExpandedChange?.(keys)
      },
      'onUpdate:expandedKeys': (keys: (string | number)[]) => {
        expandedKeys.value = keys
        attrs['onUpdate:expandedKeys']?.(keys)
      }
    }

    return (
      <div class="ab-table-body">
        <Table {...tableProps}>{{ footer: renderSelectedFooter }}</Table>
      </div>
    )
  }

  if (props.editable) {
    return (
      <Form class="ab-table-form" ref={formRef} model={props.modelValue}>
        {{ default: () => renderArcoTable() }}
      </Form>
    )
  }

  return renderArcoTable()
}

/** 树形表的序号列使用 operation 列，避免占用 Arco 树展开按钮所在的首个数据列。 */
function buildComponents(
  props: TableProps,
  attrs: Recordable,
  pageSizeRef: Ref<number>,
  pageRef: Ref<number>,
  expandedKeys: Ref<(string | number)[]>
): TableComponents | undefined {
  if (!shouldUseIndexOperation(props)) {
    return attrs.components
  }

  const originComponents = attrs.components as TableComponents | undefined
  return {
    ...(originComponents || {}),
    operations: operations => {
      const originOperations = originComponents?.operations
        ? originComponents.operations(operations)
        : [operations.dragHandle, operations.expand, operations.selection].filter(Boolean)
      const indexOperation = buildIndexOperation(props, pageSizeRef, pageRef, expandedKeys)

      if (!indexOperation.fixed) {
        return [...originOperations, indexOperation]
      }

      return [
        ...originOperations.map(operation =>
          operation.fixed ? { ...operation, isLastLeftFixed: false } : operation
        ),
        { ...indexOperation, isLastLeftFixed: true }
      ]
    }
  }
}

/** 构建树形表序号 operation 列。 */
function buildIndexOperation(
  props: TableProps,
  pageSizeRef: Ref<number>,
  pageRef: Ref<number>,
  expandedKeys: Ref<(string | number)[]>
): TableOperationColumn {
  const config = typeof props.indexable === 'object' ? props.indexable : {}
  const indexMap = new Map<string | number, number>()
  getVisibleTreeRows(props.modelValue, props.rowKey, expandedKeys.value).forEach((row, index) => {
    const key = row?.[props.rowKey]
    if (key !== undefined) {
      indexMap.set(key, index)
    }
  })

  return {
    name: '__abIndex',
    title: config.label ?? t('table.index'),
    width: config.width ?? 70,
    fixed: (config.fixed ?? 'left') === 'left',
    render: record => {
      const rawRow = getRawRecord(record)
      if (rawRow?.__abSummary) {
        return rawRow.__abIndex || props.emptyValue
      }
      const index = indexMap.get(rawRow?.[props.rowKey])
      return index === undefined
        ? props.emptyValue
        : setIndex(index, pageSizeRef.value || 10, pageRef.value || 1)
    }
  }
}

/** 合并 AbTable 自适应高度和调用方显式滚动配置。 */
function buildScroll(props: TableProps): TableProps['scroll'] | undefined {
  if (!props.adaptive) {
    return props.scroll
  }

  const scroll = {
    ...(props.scroll || {}),
    y: props.scroll?.y ?? '100%'
  }

  if (scroll.x === undefined && scroll.minWidth === undefined) {
    scroll.minWidth = '100%'
  }

  return scroll
}

/** 将 Table 顶层 selectable 配置翻译为 Arco rowSelection。 */
function buildRowSelection(props: TableProps): TableRowSelection | undefined {
  if (!props.selectable) {
    return undefined
  }
  const config = typeof props.selectable === 'object' ? props.selectable : {}
  return {
    type: config.type ?? 'checkbox',
    showCheckedAll: config.type === 'radio' ? false : (config.showCheckedAll ?? true),
    fixed: true,
    ...config,
    width: config.width ?? 50
  }
}

/** 将 Table 顶层 expandable 配置翻译为 Arco expandable。 */
function buildExpandable(props: TableProps, slots: TableSlots): TableExpandable | undefined {
  if (!props.expandable) {
    return undefined
  }
  const { label, width, render, ...rest } = props.expandable
  return {
    ...rest,
    title: label ?? '',
    width: width ?? 50,
    fixed: true,
    expandedRowRender: record => {
      const raw = getRawRecord(record)
      if (render) {
        return render(raw)
      }
      return getSlot(slots, 'expand', { row: raw, column: {} as any, rowIndex: -1, $index: -1 })
    }
  }
}

/** 将 Table 顶层 draggable 配置翻译为 Arco draggable。 */
function buildDraggable(props: TableProps): TableDraggable | undefined {
  if (!props.draggable) {
    return undefined
  }
  const config = typeof props.draggable === 'object' ? props.draggable : {}
  return {
    type: config.type ?? 'handle',
    fixed: true,
    ...config,
    title: config.label ?? '',
    width: config.width ?? 40
  }
}

/** 构建 Arco summary 配置，默认按 dataIndex 输出一行合计数据。 */
function buildSummary(props: TableProps) {
  if (!props.showSummary) {
    return undefined
  }
  if (props.summaryMethod) {
    return (params: { columns: TableColumnData[]; data: TableData[] }) => {
      return props.summaryMethod?.(params)?.map(markSummaryRow) || []
    }
  }
  return ({ columns, data }: { columns: TableColumnData[]; data: TableData[] }) => {
    const row: TableData = markSummaryRow({})
    columns.forEach((column, index) => {
      const dataIndex = column.dataIndex || ''
      if (!dataIndex) {
        return
      }
      if (index === 0) {
        row[dataIndex] = t('table.summary.total')
        return
      }
      const findColumn = findColumnByKey(props.columns, dataIndex) || findColumnByField(props.columns, dataIndex)
      if (!findColumn?.summable) {
        row[dataIndex] = props.emptyValue
        return
      }
      const values = data.map(item => Number(getRawRecord(item)[dataIndex]))
      if (findColumn.summaryMethod !== undefined) {
        row[dataIndex] = findColumn.summaryMethod(values)
        return
      }
      if (findColumn.type === 'amount') {
        const count = sumValues(values)
        const {
          amountThousand = false,
          amountDecimal = true,
          amountDigits = 2,
          amountUnit = '',
          amountUnitPosition = 'right'
        } = findColumn.typeProps || {}
        row[dataIndex] = formatAmount(count, {
          amountThousand,
          amountDecimal,
          amountDigits,
          amountUnit,
          amountUnitPosition,
          defaultValue: props.emptyValue
        })
        return
      }
      row[dataIndex] = values.every(value => Number.isNaN(value))
        ? props.emptyValue
        : `${sumValues(values)}`
    })
    return [row]
  }
}

/** 标记 Table 自建合计行，避免合计单元格进入普通行编辑/格式化渲染链路。 */
function markSummaryRow(row: TableData): TableData {
  return {
    ...row,
    __abSummary: true
  }
}

/** 累加数值数组，自动忽略 NaN。 */
function sumValues(values: number[]) {
  return values.reduce((prev, curr) => {
    return Number.isNaN(curr) ? prev : prev + curr
  }, 0)
}

/** 根据 rowKey 将 Arco 的 selectedKeys 还原为原始行对象。 */
function getRowsByKeys(rows: Recordable[], rowKey: string, keys: (string | number)[]) {
  const keySet = new Set(keys)
  return rows.filter(row => keySet.has(row[rowKey]))
}
