import { Button, Doption, Dropdown } from '@arco-design/web-vue'
import { AbIcon } from '@/components/Icon'
import type {
  TableAction,
  TableColumn,
  TableColumnFn,
  TableEmits,
  TableProps
} from '../types'
import { isDisabledAction, isHiddenAction, isLoadingAction } from '../utils'
import type { VNode } from 'vue'
import { t, logger } from '@/locale'

/** 操作列渲染上下文。 */
export interface ActionRenderContext {
  props: TableProps
  column: TableColumn
  row: Recordable
  index: number
  emit: TableEmits
}

/** 渲染操作列按钮和更多菜单。 */
export function renderActionColumn(ctx: ActionRenderContext): VNode | string {
  const { column, row, index, props } = ctx
  const actions = resolveActions(ctx)

  if (!actions.length) {
    logger.warn('console.table.actionTypeRequired', undefined, column)
    return props.emptyValue || '-'
  }

  const visibleActions = actions.filter(action => !isHiddenAction(action, row, index, props, column))
  const { normalActions, dropdownActions } = categorizeActions(visibleActions)
  const showMoreButton = dropdownActions.length > 1
  const showSingleButton = dropdownActions.length === 1
  const align = column.align ?? props.align ?? 'left'
  const rowClassAlign = getAlignClass(align)
  const handlers = createActionHandlers(ctx, dropdownActions)

  return (
    <div class={`ab-table-cell-value w-full flex flex-row items-center gap-2 ${rowClassAlign}`}>
      {normalActions.length > 0 &&
        normalActions.map(action => renderActionButton(action, handlers.handleClick, ctx))}
      {showMoreButton && renderMoreDropdown(column, dropdownActions, handlers.handleCommand, ctx)}
      {showSingleButton && renderActionButton(dropdownActions[0]!, handlers.handleClick, ctx)}
    </div>
  )
}

/** 解析静态或动态操作项。 */
function resolveActions(ctx: ActionRenderContext) {
  const { column, row, index, props } = ctx
  const actions = column.typeProps?.actions
  if (Array.isArray(actions)) {
    return actions
  }
  if (typeof actions === 'function') {
    return actions(row, index, column, props.form, props.excontext, props.editable) || []
  }
  return []
}

/** 根据 dropdown 策略拆分常规按钮和下拉按钮。 */
function categorizeActions(actions: TableAction[]) {
  const dropdownActions = actions.filter(
    action => action.dropdown && ['always', 'auto'].includes(action.dropdown)
  )
  const normalActions = actions.filter(action => !action.dropdown || action.dropdown === 'never')
  return { normalActions, dropdownActions }
}

/** 创建操作按钮点击与下拉命令处理器。 */
function createActionHandlers(ctx: ActionRenderContext, dropdownActions: TableAction[]) {
  const { row, index, column, props, emit } = ctx

  const handleClick = (name: string, event?: TableColumnFn<void>) => {
    emit('action', { name, row, index })
    try {
      event?.(row, index, column, props.form, props.excontext, props.editable)
    } catch (e) {
      logger.error('console.table.actionEventError', undefined, e, column)
    }
  }

  const handleCommand = (command: string | number | Record<string, any> | undefined) => {
    const commandName = String(command)
    const findAction = dropdownActions.find(action => action.name === commandName)
    if (findAction) {
      handleClick(findAction.name, findAction.event)
    } else {
      logger.warn('console.table.actionNotFound', { command: commandName }, column)
    }
  }

  return { handleClick, handleCommand }
}

/** 渲染单个操作按钮。 */
function renderActionButton(
  action: TableAction,
  handleClick: (name: string, event?: TableColumnFn<void>) => void,
  ctx: ActionRenderContext
) {
  const buttonAttrs = getButtonAttrs(action, ctx)

  return (
    <Button onClick={() => handleClick(action.name, action.event)} {...buttonAttrs}>
      {!action.noIcon && action.icon && <AbIcon icon={action.icon} size={14} class="mr-1" />}
      {!action.noLabel && action.label && <span>{action.label}</span>}
    </Button>
  )
}

/** 合并操作按钮属性并转换旧 type 语义到 Arco Button。 */
function getButtonAttrs(action: TableAction, ctx: ActionRenderContext) {
  const { row, index, props, column } = ctx
  const buttonAttrs: any = {
    type: action.type || 'secondary',
    ...(action.buttonAttrs || {}),
    disabled: isDisabledAction(action, row, index, props, column),
    loading: isLoadingAction(action, row, index, props, column)
  }
  return buttonAttrs
}

/** 渲染更多操作下拉菜单。 */
function renderMoreDropdown(
  column: TableColumn,
  dropdownActions: TableAction[],
  handleCommand: (command: string | number | Record<string, any> | undefined) => void,
  ctx: ActionRenderContext
) {
  return (
    <Dropdown trigger="click" onSelect={handleCommand}>
      {{
        default: () => (
          <Button
            type="secondary"
            size={column?.typeProps?.actionDropdown?.size ?? 'medium'}
            {...(column?.typeProps?.actionDropdown?.buttonAttrs || {})}
          >
            {!column?.typeProps?.actionDropdown?.noIcon && (
              <AbIcon
                icon={column?.typeProps?.actionDropdown?.icon ?? 'icon-park-outline:more'}
                size={column?.typeProps?.actionDropdown?.iconSize ?? 14}
                class={column?.typeProps?.actionDropdown?.noLabel ? '' : 'mr-1'}
              />
            )}
            {!column?.typeProps?.actionDropdown?.noLabel && <span>{t('table.action.more')}</span>}
          </Button>
        ),
        content: () => dropdownActions.map(action => renderDropdownItem(action, ctx))
      }}
    </Dropdown>
  )
}

/** 渲染更多菜单中的单个操作项。 */
function renderDropdownItem(action: TableAction, ctx: ActionRenderContext) {
  const { row, index, props, column } = ctx
  return (
    <Doption value={action.name} disabled={isDisabledAction(action, row, index, props, column)}>
      <div class="ab-table-action-option">
        {action.icon && <AbIcon icon={action.icon} size={14}/>}
        <span class="ml-1">{action.label}</span>
      </div>
    </Doption>
  )
}

/** 将列对齐方式转换为 flex justify class。 */
function getAlignClass(align: 'left' | 'center' | 'right'): string {
  const alignMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }
  return alignMap[align] || 'justify-start'
}
