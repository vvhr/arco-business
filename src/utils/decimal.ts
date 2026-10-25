/** 十进制字符串只在系数上使用整数运算，不经过浮点数转换。 */
interface Decimal {
  coefficient: bigint
  scale: number
  negative: boolean
}

// 避免旧构建目标把 bigint 的幂运算降级为不支持 bigint 的 Math.pow。
function powerOfTen(exponent: number): bigint {
  return BigInt(`1${'0'.repeat(exponent)}`)
}

function parseDecimal(value: unknown): Decimal | null {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'bigint')
    return null
  const match = /^([+-]?)(\d*\.?\d+|\d+\.)(?:e([+-]?\d+))?$/i.exec(String(value).trim())
  if (!match) return null
  const exponent = Number(match[3] || 0)
  if (!Number.isInteger(exponent) || Math.abs(exponent) > 10000) return null
  const [integer = '', fraction = ''] = match[2].split('.')
  let coefficient = BigInt((integer || '0') + fraction)
  let scale = fraction.length - exponent
  if (scale < 0) {
    coefficient *= powerOfTen(-scale)
    scale = 0
  }
  if (match[1] === '-') coefficient = -coefficient
  return { coefficient, scale, negative: match[1] === '-' }
}

function precisionOf(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.floor(value))) : 2
}

function renderDecimal(decimal: Decimal, precision: number, pad: boolean, round = true): string {
  const digits = precisionOf(precision)
  let absolute = decimal.coefficient < BigInt(0) ? -decimal.coefficient : decimal.coefficient
  if (decimal.scale > digits) {
    const divisor = powerOfTen(decimal.scale - digits)
    const remainder = absolute % divisor
    absolute /= divisor
    if (round && remainder * BigInt(2) >= divisor) absolute += BigInt(1)
  } else if (decimal.scale < digits) {
    absolute *= powerOfTen(digits - decimal.scale)
  }
  const text = absolute.toString().padStart(digits + 1, '0')
  const integer = digits ? text.slice(0, -digits) : text
  let fraction = digits ? text.slice(-digits) : ''
  if (!pad) fraction = fraction.replace(/0+$/, '')
  return `${decimal.negative ? '-' : ''}${integer}${fraction ? `.${fraction}` : ''}`
}

/** 按 half-expand 舍入，与 Intl.NumberFormat 默认舍入方式一致。 */
export function formatDecimal(value: unknown, precision = 2, pad = true): string | null {
  const decimal = parseDecimal(value)
  return decimal ? renderDecimal(decimal, precision, pad) : null
}

/** 输入回填展开科学计数法，保持输入组件截断小数而不四舍五入的契约。 */
export function truncateDecimal(value: unknown, precision: number): string | null {
  const decimal = parseDecimal(value)
  return decimal ? renderDecimal(decimal, precision, false, false) : null
}

export function isDecimalZero(value: unknown): boolean {
  return parseDecimal(value)?.coefficient === BigInt(0)
}

/** 忽略空值及非法值，完整累加后再按可选精度舍入。 */
export function sumAmounts(values: unknown[], precision?: number): string {
  const decimals = values.map(parseDecimal).filter((value): value is Decimal => value !== null)
  const scale = decimals.reduce((max, value) => Math.max(max, value.scale), 0)
  const coefficient = decimals.reduce(
    (total, value) => total + value.coefficient * powerOfTen(scale - value.scale),
    BigInt(0)
  )
  const decimal = { coefficient, scale, negative: coefficient < BigInt(0) }
  if (precision !== undefined) return renderDecimal(decimal, precision, true)
  // 求和没有指定展示精度时保留全部有效小数，不限制为格式化函数的 100 位上限。
  const text = (coefficient < BigInt(0) ? -coefficient : coefficient)
    .toString()
    .padStart(scale + 1, '0')
  const integer = scale ? text.slice(0, -scale) : text
  const fraction = scale ? text.slice(-scale).replace(/0+$/, '') : ''
  return `${decimal.negative ? '-' : ''}${integer}${fraction ? `.${fraction}` : ''}`
}
