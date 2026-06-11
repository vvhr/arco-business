<script lang="tsx">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  unref
} from 'vue'
import type {
  TableColumn,
  TableColumnSelect,
  TableProps,
  TableRawInstance
} from './types'
import { renderPagination } from './render/RenderPagination'
import { renderTable } from './render/RenderTable'
import { usePagination } from './hook/usePagination'
import { useDict, type UseDictTools } from '@/utils/dict'
import { useImport } from './hook/useImport'
import { logger } from '@/locale'
import { tableProps } from './props'

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: [
    'update:modelValue',
    'update:editable',
    'update:page',
    'update:pageSize',
    'register',
    'selection-change',
    'page-change',
    'current-change',
    'row-click',
    'value-click',
    'action',
    'drag-change'
  ],
  setup(rawProps, { attrs, slots, emit, expose }) {
    const props = rawProps as unknown as TableProps
    const { components, componentConfigs } = useImport(props.imports)
    const tableRef = ref<TableRawInstance>()
    const formRef = ref<any>()
    const selectedKeys = ref<(string | number)[]>([])
    const dictTools: UseDictTools = useDict(props.dict)
    const { pageSizeRef, currentPageRef, pagination, watchPage } = usePagination(props as any, emit as any)
    const stopWatchPage = watchPage()

    const tableAttrs = computed(() => {
      const allAttrs: Recordable = { ...attrs, ...props }
      const cleanProps = [
        'modelValue',
        'columns',
        'form',
        'excontext',
        'editable',
        'page',
        'pageSize',
        'ellipsis',
        'pagination',
        'emptyValue',
        'adaptive',
        'scroll',
        'showSummary',
        'summaryMethod',
        'summarySpanMethod',
        'freshKey',
        'dict',
        'imports',
        'indexable',
        'selectable',
        'expandable',
        'draggable'
      ]
      cleanProps.forEach(prop => {
        delete allAttrs[prop]
      })
      return allAttrs
    })

    const tableData = computed(() => {
      const selectableConfig =
        props.selectable && typeof props.selectable === 'object'
          ? (props.selectable as TableColumnSelect)
          : undefined
      return props.modelValue.map((row, index) => {
        const clone: Recordable = {
          ...row,
          __abRaw: row
        }
        if (!Reflect.has(row, 'disabled') && selectableConfig?.selectable) {
          clone.disabled = selectableConfig.selectable(
            row,
            index,
            {} as TableColumn,
            props.form,
            props.excontext,
            props.editable
          ) === false
        }
        return clone
      })
    })

    onMounted(() => {
      emit('register', tableRef.value)
    })

    onUnmounted(() => {
      stopWatchPage()
    })

    function updateSelections(rows: Recordable[]) {
      if (!props.rowKey) {
        logger.warn('console.table.rowKeyRequired')
        return
      }
      const keys = rows.map(row => row[props.rowKey]).filter(key => key !== undefined)
      updateSelectionKeys(keys)
    }

    function updateSelectionKeys(keys: (string | number)[]) {
      if (!props.rowKey) {
        logger.warn('console.table.rowKeyRequired')
        return
      }
      selectedKeys.value = keys
      emit('selection-change', getRowsBySelectedKeys(props.modelValue, props.rowKey, keys))
    }

    function handlePageChange(currentPage: number, pageSize: number) {
      emit('page-change', { page: currentPage, pageSize })
    }

    async function validate() {
      if (!props.editable) {
        return true
      }
      if (!formRef.value) {
        return true
      }
      const errors = await formRef.value.validate()
      return !errors
    }

    function resetValidate() {
      unref(formRef)?.clearValidate?.()
    }

    function getRowsBySelectedKeys(rows: Recordable[], rowKey: string, keys: (string | number)[]) {
      const keySet = new Set(keys)
      return rows.filter(row => keySet.has(row[rowKey]))
    }

    expose({
      updateSelections,
      updateSelectionKeys,
      validate,
      resetValidate
    })

    return () => (
      <div class={`ab-table ${props.adaptive ? 'is-adaptive' : ''}`}>
        {renderTable(
          props as any,
          slots as any,
          emit as any,
          pageSizeRef,
          currentPageRef,
          tableRef,
          formRef,
          tableAttrs,
          selectedKeys,
          tableData as any,
          dictTools,
          components.value,
          componentConfigs.value
        )}
        {renderPagination(
          props as any,
          pageSizeRef,
          currentPageRef,
          pagination as any,
          handlePageChange
        )}
      </div>
    )
  }
})
</script>

<style lang="less">
.ab-table {
  width: 100%;
  min-width: 0;

  &.is-adaptive {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;

    > .ab-table-form {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;

      > .arco-form-item {
        margin-bottom: 0;
      }

      .ab-table-body {
        flex: 1;
        min-height: 0;
      }
    }

    > .ab-table-body,
    .ab-table-form > .ab-table-body {
      flex: 1;
      min-height: 0;
    }

    .ab-table-main {
      height: 100%;
    }

    .arco-table,
    .arco-spin,
    .arco-spin-children,
    .arco-table-container {
      height: 100%;
      min-height: 0;
    }
  }

  .ab-table-body {
    width: 100%;
    min-width: 0;
  }

  .ab-table-form {
    min-width: 0;
  }

  .copyable-icon {
    cursor: pointer;
    color: var(--color-text-3);
    transition: color 0.1s ease-in;

    &:hover {
      color: rgb(var(--primary-6));
    }
  }

  .clickable-text {
    color: rgb(var(--primary-6));
    cursor: pointer;
    max-width: fit-content;

    &:hover {
      text-decoration: underline;
    }
  }

  .ab-table-cell-value {
    min-width: 0;
  }

  .ab-table-column-editable {
    .arco-table-cell {
      padding: 4px 8px;
    }
    .arco-form-item {
      margin-bottom: 0;
      > .arco-form-item-label-col {
        padding-right: 0;
        width: 12px;
        flex: none;
      }
      > .arco-form-item-wrapper-col {
        &.arco-col {
          flex: 1;
          width: 0;
        }
      }
    }

    .arco-form-item-message {
      min-height: 14px;
      font-size: 12px;
    }
  }

  .ab-table-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .ab-table-action-option {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .ab-table-append-selection {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    background: var(--color-bg-1);
    .total {
      color: rgb(var(--primary-6));
    }
  }

  .ab-table-pagination {
    padding: 15px 0;
    display: flex;
    justify-content: flex-end;
    flex: 0 0 auto;
  }

  .arco-scrollbar-track-direction-horizontal {
    height: 10px;
  }
}
</style>
