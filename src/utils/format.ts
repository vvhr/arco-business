import dayjs from 'dayjs'
import { formatDecimal, isDecimalZero } from './decimal'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import { logger, onLocaleChange } from '@/locale'
import type { Language } from '@/locale/types'

/**
 * dayjs 语言映射
 */
const dayjsLocaleMap: Record<Language, string> = {
  'zh-CN': 'zh-cn',
  'en-US': 'en'
}

/**
 * 同步 dayjs 语言设置
 */
function syncDayjsLocale(locale: Language) {
  dayjs.locale(dayjsLocaleMap[locale] || 'zh-cn')
}

// 注册语言切换监听，自动同步 dayjs 语言
onLocaleChange(syncDayjsLocale)

/**
 * 对字符串进行脱敏处理。
 * @param value - 需要脱敏的原始字符串。
 * @param searchRegex - 用于查找需要脱敏部分的正则表达式。
 *                  这个正则表达式应该通常带有全局标志 'g' 来替换所有匹配项。
 * @param replacement - 用于替换匹配部分的字符串。
 *                      例如: "***", "****", "[REDACTED]", "$1" (如果 searchRegex 有捕获组)
 * @returns 脱敏后的字符串。
 */
export function formatSensitive(
  value: string,
  searchRegex: RegExp | string,
  replacement: string // 修正：这里更合理应该是 string，表示替换内容
): string {
  if (!value) {
    return value
  }
  let searchRegex_: RegExp
  if (typeof searchRegex === 'string') {
    searchRegex_ = new RegExp(searchRegex, 'g')
  } else {
    searchRegex_ = searchRegex
  }
  const globalSearchRegex = searchRegex_.global
    ? searchRegex_
    : new RegExp(searchRegex_.source, searchRegex_.flags + 'g')
  return value.replace(globalSearchRegex, replacement)
}

/**
 * 格式化日期/时间。
 *
 * @param value - 要格式化的日期/时间。例如: new Date(), 1678886400000, '2023-03-15T10:00:00Z', '2023-03-15'
 * @param formatString - 期望的输出格式字符串。
 * @returns 格式化后的日期字符串。如果输入的 `value` 无法解析为有效日期，则返回一个空字符串。
 */
export function formatDate(value: string | number | Date, formatString?: string): string {
  const finalFormatString = formatString || 'YYYY-MM-DD'
  try {
    const date = dayjs(value)
    if (!date.isValid()) {
      logger.warn('console.format.invalidDate', { value })
      return '' // 返回空字符串表示无效日期
    }
    return date.format(finalFormatString)
  } catch (error) {
    logger.error('console.format.dateFormatError', { value, format: finalFormatString }, error)
    return '' // 发生错误时返回空字符串
  }
}

/**
 * 格式化金额工具函数
 *
 * @param value - 需要格式化的数值 (可以是 number, string, null, undefined)
 * @param config - 格式化配置项
 * @returns 格式化后的金额字符串
 */
export interface AmountFormatOptions {
  amountThousand?: boolean
  amountDecimal?: boolean
  amountDigits?: number
  amountZero?: boolean
  amountZeroDisplay?: string
  amountUnit?: string
  amountUnitPosition?: 'left' | 'right'
  defaultValue?: string
}

export function formatAmount(
  value: number | string | null | undefined,
  config: AmountFormatOptions = {}
): string {
  const {
    amountThousand = true,
    amountDecimal = true,
    amountDigits = 2,
    amountZero = true,
    amountZeroDisplay,
    amountUnit = '',
    amountUnitPosition = 'left',
    defaultValue = '0'
  } = config
  const decimal = formatDecimal(value, amountDecimal ? amountDigits : 0, amountZero)
  if (decimal === null) {
    return amountUnit
      ? amountUnitPosition === 'left'
        ? amountUnit + defaultValue
        : defaultValue + amountUnit
      : defaultValue
  }
  if (amountZeroDisplay !== undefined && isDecimalZero(value)) return amountZeroDisplay
  const parts = decimal.split('.')
  let integer = parts[0]
  const fraction = parts[1]
  if (amountThousand) integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = integer + (fraction ? '.' + fraction : '')
  return amountUnit
    ? amountUnitPosition === 'left'
      ? amountUnit + ' ' + formatted
      : formatted + ' ' + amountUnit
    : formatted
}
