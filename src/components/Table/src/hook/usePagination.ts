import { computed, ref, unref, watch } from 'vue'
import type { TableEmits, TableProps } from '../types'

/** 管理 Table 独立分页器的受控页码与每页条数。 */
export function usePagination(props: TableProps, emit: TableEmits) {
  const pageSizeRef = ref(props.pageSize)
  const currentPageRef = ref(props.page)

  const pagination = computed(() => {
    return Object.assign(
      {
        disabled: false,
        hideOnSinglePage: false,
        showTotal: true,
        showJumper: true,
        showPageSize: true,
        pageSizeOptions: [10, 20, 30, 40, 50, 100],
        total: 0
      },
      { total: unref(props).total, ...(unref(props).pagination || {}) }
    )
  })

  /** 同步内部分页状态与外部 v-model，并返回停止监听函数。 */
  function watchPage() {
    const stop1 = watch(
      () => pageSizeRef.value,
      (val: number) => emit('update:pageSize', val)
    )
    const stop2 = watch(
      () => currentPageRef.value,
      (val: number) => emit('update:page', val)
    )
    const stop3 = watch(
      () => unref(props).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )
    const stop4 = watch(
      () => unref(props).page,
      (val: number) => {
        currentPageRef.value = val
      }
    )

    return () => {
      stop1()
      stop2()
      stop3()
      stop4()
    }
  }

  return {
    pageSizeRef,
    currentPageRef,
    pagination,
    watchPage
  }
}
