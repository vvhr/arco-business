import type { AmountEmptyValue, AmountModelValue, NormalizedAmountInputResult } from './types'
import { truncateDecimal } from '@/utils/decimal'
export function normalizeAmountInputValue(
  rawValue: string,
  precision: number,
  emptyValue: AmountEmptyValue
): NormalizedAmountInputResult {
  const sanitized = sanitizeAmount(rawValue, precision)
  if (!sanitized || sanitized === '-') {
    return {
      display: sanitized,
      normalized: '',
      output: emptyValue
    }
  }
  const normalized = normalizeSanitizedAmount(sanitized, precision)
  return {
    display: sanitized,
    normalized,
    output: normalized
  }
}
export function normalizeExternalAmountValue(value: AmountModelValue, precision: number): string {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'number' || /^[+-]?(?:\d+\.?\d*|\.\d+)[eE][+-]?\d+$/.test(value.trim())) {
    return truncateDecimal(value, precision) ?? ''
  }
  return normalizeAmountInputValue(String(value), precision, null).normalized
}
export function formatDisplayValue(
  value: string,
  precision: number,
  useThousands: boolean
): string {
  if (!value) return ''
  return useThousands
    ? formatWithThousands(value, precision, true)
    : alignFractionDigits(value, precision, true)
}
export function formatEditableValue(
  value: string,
  precision: number,
  useThousands = false
): string {
  if (!value || value === '-') return value
  const sanitized = sanitizeAmount(value, precision)
  if (!sanitized || sanitized === '-') return sanitized
  const { sign, unsigned } = splitSignedAmount(sanitized)
  const hasDecimalPoint = unsigned.includes('.')
  const [integerPartRaw = '0', decimalPart = ''] = unsigned.split('.')
  const integerPart = normalizeIntegerPart(integerPartRaw)
  const displayedInteger = useThousands
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : integerPart
  const displayedUnsigned = hasDecimalPoint
    ? `${displayedInteger}.${decimalPart}`
    : displayedInteger
  return sign ? `${sign}${displayedUnsigned}` : displayedUnsigned
}
export function sanitizeAmount(rawValue: string, precision: number): string {
  const source = String(rawValue ?? '')
    .replace(/,/g, '')
    .trim()
  if (!source) return ''
  const isNegative = source.startsWith('-')
  const unsignedSource = isNegative ? source.slice(1) : source
  let result = ''
  let hasDot = false
  for (const char of unsignedSource) {
    if (char >= '0' && char <= '9') {
      result += char
      continue
    }
    if (char === '.' && !hasDot) {
      hasDot = true
      result += result ? '.' : '0.'
    }
  }
  if (!result) return isNegative ? '-' : ''
  const [integerPartRaw = '', decimalPartRaw = ''] = result.split('.')
  const integerPart = normalizeIntegerPart(integerPartRaw)
  const decimalPart = precision > 0 ? decimalPartRaw.slice(0, precision) : ''
  const unsignedAmount = hasDot && precision > 0 ? `${integerPart}.${decimalPart}` : integerPart
  return isNegative ? `-${unsignedAmount}` : unsignedAmount
}
export function normalizeIntegerPart(value: string): string {
  const stripped = value.replace(/^0+(?=\d)/, '')
  return stripped || '0'
}
export function normalizeSanitizedAmount(value: string, precision: number): string {
  if (!value || value === '-') return ''
  const { sign, unsigned } = splitSignedAmount(value)
  const [integerPartRaw = '0', decimalPartRaw = ''] = unsigned.split('.')
  const integerPart = normalizeIntegerPart(integerPartRaw)
  const decimalPart = precision > 0 ? decimalPartRaw.slice(0, precision) : ''
  const normalized = decimalPart ? `${integerPart}.${decimalPart}` : integerPart
  return sign ? `${sign}${normalized}` : normalized
}
export function alignFractionDigits(value: string, precision: number, padEnd: boolean): string {
  if (!value || value === '-') return ''
  const { sign, unsigned } = splitSignedAmount(value)
  if (precision <= 0) {
    const integerPart = normalizeIntegerPart(unsigned.split('.')[0] || '0')
    return sign ? `${sign}${integerPart}` : integerPart
  }
  const [integerPartRaw = '0', decimalPartRaw = ''] = unsigned.split('.')
  const integerPart = normalizeIntegerPart(integerPartRaw)
  if (!decimalPartRaw) {
    const aligned = padEnd ? `${integerPart}.${''.padEnd(precision, '0')}` : integerPart
    return sign ? `${sign}${aligned}` : aligned
  }
  const decimalPart = padEnd
    ? decimalPartRaw.slice(0, precision).padEnd(precision, '0')
    : decimalPartRaw.slice(0, precision)
  const aligned = decimalPart ? `${integerPart}.${decimalPart}` : integerPart
  return sign ? `${sign}${aligned}` : aligned
}
export function formatWithThousands(value: string, precision: number, padEnd: boolean): string {
  if (!value) return ''
  const aligned = alignFractionDigits(value, precision, padEnd)
  const { sign, unsigned } = splitSignedAmount(aligned)
  const [integerPart = '0', decimalPart = ''] = unsigned.split('.')
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const result = decimalPart ? `${grouped}.${decimalPart}` : grouped
  return sign ? `${sign}${result}` : result
}
export function toChineseUppercase(value: string, precision: number): string {
  const normalized = normalizeExternalAmountValue(value, precision)
  if (!normalized) return ''
  const { sign, unsigned } = splitSignedAmount(normalized)
  const [integerPartText = '0', decimalPartText = ''] = unsigned.split('.')
  const integerPart = integerPartText.replace(/^0+(?=\d)/, '') || '0'
  const fraction = decimalPartText.slice(0, 2).padEnd(2, '0')
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const smallUnits = ['', '拾', '佰', '仟']
  const sectionUnits = ['', '万', '亿', '兆']
  const integerToChinese = (num: string) => {
    if (num === '0') return '零'
    const sections: string[] = []
    for (let end = num.length; end > 0; end -= 4) {
      sections.unshift(num.slice(Math.max(0, end - 4), end))
    }
    let result = ''
    let pendingZero = false
    sections.forEach((section, sectionIndex) => {
      const sectionNumber = Number(section)
      if (sectionNumber === 0) {
        pendingZero = result !== ''
        return
      }
      let sectionText = ''
      for (let i = 0; i < section.length; i += 1) {
        const digit = Number(section[i])
        const pos = section.length - i - 1
        if (digit === 0) {
          if (sectionText && !sectionText.endsWith('零')) {
            sectionText += '零'
          }
          continue
        }
        sectionText += `${digits[digit]}${smallUnits[pos]}`
      }
      sectionText = sectionText.replace(/零+$/g, '')
      if (pendingZero && !result.endsWith('零')) {
        result += '零'
      }
      result += sectionText
      result += sectionUnits[sections.length - sectionIndex - 1]
      pendingZero = section.length < 4 || /0$/.test(section)
    })
    return result.replace(/零+/g, '零').replace(/零$/g, '')
  }
  const integerText = `${sign ? '负' : ''}${integerToChinese(integerPart)}元`
  const jiao = Number(fraction[0] || '0')
  const fen = Number(fraction[1] || '0')
  if (jiao === 0 && fen === 0) {
    return `${integerText}整`
  }
  let fractionText = ''
  if (jiao > 0) {
    fractionText += `${digits[jiao]}角`
  } else if (fen > 0) {
    fractionText += '零'
  }
  if (fen > 0) {
    fractionText += `${digits[fen]}分`
  }
  return `${integerText}${fractionText}`.replace(/零+/g, '零')
}
function splitSignedAmount(value: string): { sign: '-' | ''; unsigned: string } {
  if (value.startsWith('-')) {
    return { sign: '-', unsigned: value.slice(1) }
  }
  return { sign: '', unsigned: value }
}
