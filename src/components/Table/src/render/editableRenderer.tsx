import { FormItem } from '@arco-design/web-vue'
import type {
  TableColumn,
  TableEmits,
  TableFormComponentName,
  TableProps,
  TableSlots
} from '../types'
import type { TableFormImportItemConfig } from '@/types/imports'
import { useComponent } from '../hook/useComponent'
import type { Component, VNode } from 'vue'
import { logger, t } from '@/locale'

/** 编辑态单元格渲染上下文。 */
export interface EditableRenderContext {
  props: TableProps
  slots: TableSlots
  emit: TableEmits
  column: TableColumn
  row: Recordable
  index: number
  components: Partial<Recordable<Component, TableFormComponentName>>
  componentConfigs: Partial<Recordable<TableFormImportItemConfig, TableFormComponentName>>
}

/** 渲染 Arco FormItem 包裹的编辑组件。 */
export function renderEditableColumn(ctx: EditableRenderContext): VNode | undefined {
  const { props, slots, emit, column, row, index, components, componentConfigs } = ctx

  const {
    field,
    freshKey,
    formItemProps,
    getAnyComponent,
    setModelValue,
    setComponentProps,
    setComponentEvent,
    setInsideRenders
  } = useComponent(props, slots, emit, row, index, column, props.form, components, componentConfigs)

  if (!field) {
    logger.warn('console.table.editFieldRequired', undefined, column)
  }

  const renderEditComponent = () => {
    const AnyComponent = getAnyComponent()

    if (AnyComponent === undefined) {
      logger.error('console.table.editComponentError', undefined, column)
      return renderErrorPlaceholder(column)
    }

    return (
      <AnyComponent
        {...setModelValue()}
        {...setComponentProps()}
        {...setComponentEvent()}
        key={freshKey}
      >
        {{ ...setInsideRenders() }}
      </AnyComponent>
    )
  }

  return <FormItem {...formItemProps}>{{ default: () => renderEditComponent() }}</FormItem>
}

/** 编辑组件注册缺失时的占位提示。 */
function renderErrorPlaceholder(column: TableColumn): VNode {
  const component = column.editProps?.component || ''
  return (
    <div class="ab-table-edit-error" style="color: rgb(var(--danger-6)); font-size: 12px;">
      {t('table.editComponentNotFound', { component })}
    </div>
  )
}
