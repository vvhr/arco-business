import { Form, Table } from '@arco-design/web-vue'
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
import type { TableFormImportItemConfig } from '@/types/imports'
import { computed, unref, type Component, type Ref } from 'vue'
import { renderTableColumns } from './RenderTableColumn'
import type { UseDictTools } from '@/utils/dict'
import { findColumnByField, findColumnByKey, getRawRecord } from '../utils'
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

  /** 在选择列启用且存在选中行时追加选择统计，不覆盖用户 footer 插槽。 */
  const renderSelectedFooter = () => {
    if (selectedKeys.value.length <= 0) {
      return getSlot(slots, 'footer') || undefined
    }
    const selectedText = t('table.selection.selected')
    const itemsText = t('table.selection.items')
    return (
      <>
        {getSlot(slots, 'footer')}
        <div class="ab-table-append-selection">
          {selectedText} <span class="total">{selectedKeys.value.length}</span> {itemsText}
        </div>
      </>
    )
  }

  /** 组装最终传给 Arco Table 的属性和事件桥接。 */
  const renderArcoTable = () => {
    const tableClass = `ab-table-main ${selectedKeys.value.length > 0 ? 'has-append' : ''}`
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
      scroll: props.adaptive ? { y: '100%' } : undefined,
      ...unref(tableAttrs),
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

/** 将 Table 顶层 selectable 配置翻译为 Arco rowSelection。 */
function buildRowSelection(props: TableProps): TableRowSelection | undefined {
  if (!props.selectable) {
    return undefined
  }
  const config = typeof props.selectable === 'object' ? props.selectable : {}
  return {
    type: config.type ?? 'checkbox',
    showCheckedAll: config.type === 'radio' ? false : (config.showCheckedAll ?? true),
    ...config,
    title: config.label ?? '',
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
        row[dataIndex] = '合计'
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
