import TableComponent from './src/Table.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'
import type { DefineComponent } from 'vue'
import type { TableExpose, TableProps } from './src/types'

/** Table 在模板和全局组件声明中暴露的 props 类型。 */
type TablePublicProps = Partial<Omit<TableProps, 'onSelectionChange' | 'onRowClick' | 'onChange'>> & {
  onSelectionChange?: (value: Recordable[]) => any
  onPageChange?: (value: { page: number; pageSize: number }) => any
  onCurrentChange?: (currentRow: Recordable) => any
  onRowClick?: (row: Recordable) => any
  onValueClick?: (key: string, row: Recordable) => any
  onAction?: (event: { name: string; row: Recordable; index: number }) => any
  onDragChange?: (value: Recordable[]) => any
}

type TablePublicComponent = DefineComponent<TablePublicProps>

export const AbTable: SFCWithInstall<TablePublicComponent> = withInstall(
  TableComponent as unknown as TablePublicComponent
)
export default AbTable

/** Table 公开 props 类型，供业务侧按组件入参复用。 */
export type TableDefineProps = TablePublicProps
/** Table 组件实例类型，包含组件暴露方法。 */
export type TableInstance = InstanceType<TablePublicComponent> & TableExpose
export type {
  TableAction,
  TableChangeExtra,
  TableColumn,
  TableColumnDraggable,
  TableColumnExpand,
  TableColumnFn,
  TableColumnIndex,
  TableColumnSelect,
  TableColumnType,
  TableColumnTypeProps,
  TableColumnEditProps,
  TableEmits,
  TableExpose,
  TableFormAutoRules,
  TableFormComponentEventFn,
  TableFormComponentEvents,
  TableFormComponentName,
  TableFormComponentProps,
  TableFormInsidePropsRender,
  TableFormInsidePropsRenders,
  TablePagination,
  TableProps,
  TableRawInstance,
  TableScroll,
  TableSize,
  TableSlotDefault,
  TableSlots
} from './src/types'
