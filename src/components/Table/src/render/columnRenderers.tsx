import { Image, Message, Tag } from '@arco-design/web-vue'
import { AbIcon } from '@/components/Icon'
import DotTag from '../components/DotTag.vue'
import SensitiveSwitch from '../components/SensitiveSwitch.vue'
import { isArray } from '@/utils/is'
import { formatAmount, formatDate, formatSensitive } from '@/utils/format'
import { copyToClipboard } from '@/utils/copy'
import type { TableColumn, TableEmits, TableProps, TableRenderNode } from '../types'
import type { DictItem } from '@/types/dict'
import type { UseDictTools } from '@/utils/dict'
import { isClickable, isCopyable } from '../utils'
import { t, logger } from '@/locale'

/** 展示态列渲染器共享上下文。 */
export interface RenderContext {
  props: TableProps
  column: TableColumn
  row: Recordable
  index: number
  value: any
  originValue: any
  emptyValue: string
  dictTools: UseDictTools
  emit: TableEmits
}

/** 展示态列渲染器统一返回结构。 */
export interface RenderResult {
  value: string | number
  valueRender?: TableRenderNode
}

/** 渲染字典列，支持普通数组字典、树形字典、tag 和 dot-tag。 */
export function renderDictColumn(ctx: RenderContext): RenderResult | string {
  const { column, value, emptyValue, dictTools } = ctx

  if (!column.typeProps) {
    logger.warn('console.table.dictTypePropsRequired', undefined, column)
    return { value: value ?? emptyValue }
  }

  let dictOptions: DictItem[] = []
  if (column.typeProps.dictOptions !== undefined) {
    dictOptions = isArray(column.typeProps.dictOptions) ? column.typeProps.dictOptions : []
  } else if (column.typeProps.dictName) {
    dictOptions = dictTools.getDictOptions(column.typeProps.dictName)
  }

  if (column.typeProps.dictIsTree) {
    const label = dictTools.getTreeDictItemLabel(
      dictOptions,
      value,
      column.typeProps?.dictValueIsPath,
      column.typeProps?.dictLabelFullpath,
      column.typeProps?.dictLabelSeparator
    )
    return label ? { value: label } : emptyValue
  }

  let label: string
  if (isArray(value)) {
    label = value
      .map(val => {
        const dictItem = dictOptions.find(item => item.value === val)
        return dictItem?.label || val
      })
      .join(', ')
  } else {
    const dictItem = dictOptions.find(item => item.value === value)
    label = dictItem?.label || value
    if (!dictItem && !value) {
      return emptyValue
    }
    if (column.typeProps.dictViewRender !== undefined) {
      return {
        value: label,
        valueRender: column.typeProps.dictViewRender(ctx.originValue, label, dictItem)
      }
    }
    if (column.typeProps.dictViewType && column.typeProps.dictViewType !== 'text') {
      return renderDictViewType(column.typeProps.dictViewType, label, dictItem)
    }
  }

  return { value: label || emptyValue }
}

/** 按展示类型生成字典标签节点。 */
function renderDictViewType(
  viewType: 'tag' | 'dot-tag',
  label: string,
  dictItem?: DictItem
): RenderResult {
  const color = dictItem?.color || getArcoTagColor(dictItem?.type)

  if (viewType === 'tag') {
    const valueRender = dictItem?.icon ? (
      <Tag color={color} class="ab-table-tag">
        <AbIcon icon={dictItem.icon} size={14} />
        <span>{label}</span>
      </Tag>
    ) : (
      <Tag color={color}>{label}</Tag>
    )
    return { value: label, valueRender }
  }

  return {
    value: label,
    valueRender: <DotTag color={color} value={label} />
  }
}

/** 将旧项目语义色映射为 Arco Tag 可识别的颜色。 */
function getArcoTagColor(type?: string) {
  const colorMap: Record<string, string> = {
    primary: 'arcoblue',
    success: 'green',
    warning: 'orange',
    danger: 'red',
    error: 'red',
    info: '#86909c'
  }
  return type ? colorMap[type] || type : 'arcoblue'
}

/** 渲染金额列，复用项目级金额格式化能力。 */
export function renderAmountColumn(ctx: RenderContext): RenderResult | string {
  const { props, column, row, index, value, emptyValue } = ctx

  if (value === '' || value === null || value === undefined) {
    return emptyValue
  }

  const {
    amountThousand = false,
    amountDecimal = true,
    amountDigits = 2,
    amountZero = true,
    amountUnit = '',
    amountUnitFormat,
    amountUnitPosition = 'right'
  } = column.typeProps || {}

  const formattedAmountUnit =
    typeof amountUnitFormat === 'function'
      ? amountUnitFormat(row, index, column, props.form, props.excontext, props.editable)
      : amountUnit

  return {
    value: formatAmount(value, {
      amountThousand,
      amountDecimal,
      amountDigits,
      amountZero,
      amountUnit: formattedAmountUnit,
      amountUnitPosition,
      defaultValue: emptyValue
    })
  }
}

/** 渲染日期列，复用项目级日期格式化能力。 */
export function renderDateColumn(ctx: RenderContext): RenderResult | string {
  const { column, value, emptyValue } = ctx

  if (!value) {
    return emptyValue
  }

  const dateFormat = column.typeProps?.dateFormat || 'YYYY-MM-DD'
  return { value: formatDate(value, dateFormat) || emptyValue }
}

/** 渲染敏感信息列，支持内置类型和自定义正则。 */
export function renderSensitiveColumn(ctx: RenderContext): RenderResult | string {
  const { column, originValue, emptyValue } = ctx

  if (!originValue) {
    return emptyValue
  }

  const sensitiveRegex = column.typeProps?.sensitiveRegex
  if (sensitiveRegex && isArray(sensitiveRegex) && sensitiveRegex.length === 2) {
    const cryptoValue = formatSensitive(originValue, sensitiveRegex[0], sensitiveRegex[1])
    return { value: cryptoValue }
  }

  if (column.typeProps?.sensitiveType) {
    return renderSensitiveByType(
      column.typeProps.sensitiveType,
      originValue,
      column.typeProps?.sensitiveHover ?? false
    )
  }

  logger.warn('console.table.sensitiveTypeRequired', undefined, column)
  return emptyValue
}

/** 根据内置敏感类型生成脱敏值和可选悬停查看组件。 */
function renderSensitiveByType(
  type: 'phone' | 'idCard' | 'email',
  originValue: string,
  enableHover: boolean
): RenderResult {
  const sensitiveMap = {
    phone: { regex: /(\d{3})\d{4}(\d{4})/, replacement: '$1****$2' },
    idCard: { regex: /^(\d{3})(\d{11})([0-9Xx]{4})$/, replacement: '$1********$3' },
    email: { regex: /(.+)@(.+\..+)/, replacement: '***@$2' }
  }

  const config = sensitiveMap[type]
  if (!config) {
    logger.warn('console.table.noDesensitizationMethod', { type })
    return { value: originValue }
  }

  const cryptoValue = formatSensitive(originValue, config.regex, config.replacement)
  return {
    value: cryptoValue,
    valueRender: (
      <SensitiveSwitch originValue={originValue} cryptoValue={cryptoValue} enable={enableHover} />
    )
  }
}

/** 渲染左图右文列；文本区域复用 Table 的复制、点击与省略能力。 */
export function renderImageTextColumn(ctx: RenderContext): TableRenderNode {
  const { props, column, row, index, value, emptyValue } = ctx
  const {
    imageSrc: imageSrcMethod,
    imageProps,
    imageOnlyExsist,
    imageText: imageTextMethod
  } = column.typeProps || {}

  const imageSrc =
    imageSrcMethod?.(row, index, column, props.form, props.excontext, props.editable) ?? ''
  const imageText =
    imageTextMethod?.(row, index, column, props.form, props.excontext, props.editable) ??
    value ??
    emptyValue
  const textAlign = column.align ?? 'left'
  const textAlignClass =
    textAlign === 'right' ? 'text-right' : textAlign === 'center' ? 'text-center' : 'text-left'
  const textNode = wrapValueWithFeatures(
    ctx,
    { value: imageText },
    { ellipsis: true, align: textAlign }
  )
  const showImage = !imageOnlyExsist || Boolean(imageSrc)

  return (
    <div class="ab-table-image-text w-full min-w-0 flex flex-row items-center gap-2.5">
      {showImage && (
        <div class="ab-table-image-text__image flex-none">
          <Image
            width={30}
            height={30}
            fit="contain"
            preview={true}
            {...(imageProps || {})}
            src={imageSrc}
          />
        </div>
      )}
      <div
        class={`ab-table-image-text__text min-w-0 flex-1 overflow-hidden text-ellipsis text-nowrap ${textAlignClass}`}
      >
        {textNode}
      </div>
    </div>
  )
}

/** 给展示值追加复制、点击、对齐和省略等 Table 自建能力。 */
export function wrapValueWithFeatures(
  ctx: RenderContext,
  result: RenderResult | string | TableRenderNode,
  options: { ellipsis?: boolean; align?: TableColumn['align'] } = {}
): TableRenderNode {
  const { props, column, row, index, emit } = ctx

  if (!isRenderResult(result)) {
    return result
  }

  const { value, valueRender } = result
  const copyable = isCopyable(props, column, row, index)
  const clickable = isClickable(props, column, row, index)

  if (!copyable && !clickable) {
    return valueRender !== undefined ? valueRender : value
  }

  if (!value && value !== 0) {
    return valueRender !== undefined ? valueRender : value
  }

  const ellipsis = options.ellipsis ?? column.ellipsis ?? props.ellipsis ?? false
  const align = options.align ?? column.align ?? props.align ?? 'left'
  const rowClassAlign =
    align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'
  const textClassEllipsis = ellipsis ? 'text-ellipsis overflow-hidden text-nowrap' : ''
  const textClickable = clickable ? 'clickable-text' : ''

  const onClickCopy = () => {
    if (!copyable) return

    const copyValue =
      column.copyValueMethod !== undefined
        ? column.copyValueMethod(row, index, column, props.form, props.excontext, props.editable)
        : ctx.originValue

    copyToClipboard(copyValue).then(res => {
      if (res) {
        Message.success(t('table.copy.success'))
      } else {
        Message.error(t('table.copy.failed'))
      }
    })
  }

  const onClickValue = () => {
    if (!clickable) return

    const columnKey = column.key || column.field || ''
    emit('value-click', columnKey, row)

    if (column.clickMethod !== undefined) {
      column.clickMethod(row, index, column, props.form, props.excontext, props.editable)
    }
  }

  return (
    <div class={`ab-table-cell-value w-full flex flex-row items-center gap-2.5 ${rowClassAlign}`}>
      {copyable && (
        <AbIcon
          icon="icon-park-outline:copy"
          class="ab-table-cell-value__icon copyable-icon"
          size={15}
          onClick={() => onClickCopy()}
        />
      )}
      <div
        class={`ab-table-cell-value__text flex-1 ${textClassEllipsis} ${textClickable}`}
        onClick={() => onClickValue()}
      >
        {valueRender || value}
      </div>
    </div>
  )
}

function isRenderResult(result: RenderResult | string | TableRenderNode): result is RenderResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    !Array.isArray(result) &&
    !('type' in result) &&
    'value' in result
  )
}
