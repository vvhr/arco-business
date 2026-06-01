/** Table 内部事件处理器集合，供拆分 hooks 时复用。 */
export interface TableEventHandlers {
  /** Arco selection-change 事件桥接。 */
  handleSelectionChange: (rowKeys: (string | number)[]) => void
  /** Arco row-click 事件桥接。 */
  handleRowClick: (row: Recordable) => void
  /** Arco change 事件桥接，当前主要处理拖拽排序。 */
  handleTableChange: (data: Recordable[], extra: any) => void
}
