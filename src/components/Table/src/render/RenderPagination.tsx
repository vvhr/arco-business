import { Pagination } from '@arco-design/web-vue'
import { unref, type Ref } from 'vue'
import type { TablePagination, TableProps } from '../types'

/** 渲染独立 Arco Pagination，并桥接 page/pageSize 双向绑定。 */
export function renderPagination(
  props: TableProps,
  pageSizeRef: Ref<number>,
  currentPageRef: Ref<number>,
  pagination: Ref<TablePagination>,
  handlePageChange: (page: number, pageSize: number) => void
) {
  if (!props.pagination) {
    return undefined
  }

  return (
    <div class="ab-table-pagination">
      <Pagination
        current={currentPageRef.value}
        pageSize={pageSizeRef.value}
        {...unref(pagination)}
        onUpdate:current={(page: number) => {
          currentPageRef.value = page
        }}
        onUpdate:pageSize={(pageSize: number) => {
          pageSizeRef.value = pageSize
        }}
        onChange={(page: number) => handlePageChange(page, pageSizeRef.value)}
        onPageSizeChange={(pageSize: number) => handlePageChange(currentPageRef.value, pageSize)}
      />
    </div>
  )
}
