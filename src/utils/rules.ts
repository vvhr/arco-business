import type { FieldRule } from '@arco-design/web-vue'
import type { AutoRules } from '@/types/rules'
import { t } from '@/locale'

function createValidator(check: (v: any) => boolean, messageKey: string) {
  return (...args: any[]) => {
    const [ruleOrValue, valueOrCallback, maybeCallback] = args
    const isElementSignature = typeof maybeCallback === 'function'
    const value = isElementSignature ? valueOrCallback : ruleOrValue
    const cb = (isElementSignature ? maybeCallback : valueOrCallback) as (err?: any) => void
    const rule = isElementSignature ? ruleOrValue : undefined
    // 允许空值通过，由 other 规则（如 required）处理
    if (value === undefined || value === null || value === '') {
      return cb()
    }
    const ok = check(value)
    if (ok) {
      cb()
    } else {
      // rule.message 可能已经本地化，这里优先使用 rule.message，其次使用国际化消息
      cb(new Error(rule?.message ?? t(messageKey)))
    }
  }
}

/**
 * 获取自动验证规则映射
 * 返回国际化的验证规则，每次调用都会获取当前语言的消息
 */
export function getAutoRulesMap(): Record<AutoRules, FieldRule> {
  return {
    isRequired: {
      required: true,
      message: t('form.validation.required')
    },
    isRequiredArray: {
      required: true,
      message: t('form.validation.requiredArray'),
      validator: createValidator(
        v => Array.isArray(v) && v.length > 0,
        'form.validation.requiredArray'
      )
    },
    noSpace: {
      message: t('form.validation.noSpace'),
      validator: createValidator(
        v => (typeof v === 'string' ? !/\s/.test(v) : true),
        'form.validation.noSpace'
      )
    },
    isIdCard: {
      message: t('form.validation.idCard'),
      validator: createValidator(
        v => /^(?:\d{15}|\d{18}|\d{17}[\dX])$/.test(v),
        'form.validation.idCard'
      )
    },
    isMobilePhone: {
      message: t('form.validation.mobilePhone'),
      validator: createValidator(v => /^1[3456789]\d{9}/.test(v), 'form.validation.mobilePhone')
    },
    isAreaPhone: {
      message: t('form.validation.areaPhone'),
      validator: createValidator(
        v => /^\+[0-9]+$/.test(v),
        'form.validation.areaPhone'
      )
    },
    isTelephone: {
      message: t('form.validation.telephone'),
      validator: createValidator(
        v => /^[0-9+-]+/.test(v) && /[0-9]/.test(v),
        'form.validation.telephone'
      )
    },
    isCreditCode: {
      message: t('form.validation.creditCode'),
      validator: createValidator(
        v => /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/.test(v),
        'form.validation.creditCode'
      )
    },
    isEmail: {
      message: t('form.validation.email'),
      validator: createValidator(
        v => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+/.test(v),
        'form.validation.email'
      )
    },
    onlyNumber: {
      message: t('form.validation.onlyNumber'),
      validator: createValidator(v => /^[0-9]+/.test(v), 'form.validation.onlyNumber')
    },
    onlyLetter: {
      message: t('form.validation.onlyLetter'),
      validator: createValidator(v => /^[a-zA-Z]+$/.test(v), 'form.validation.onlyLetter')
    },
    normalText: {
      message: t('form.validation.normalText'),
      validator: createValidator(
        v => !/[^a-zA-Z0-9\u4e00-\u9fa5_\-#()（）·.]/.test(v),
        'form.validation.normalText'
      )
    },
    noChinese: {
      message: t('form.validation.noChinese'),
      validator: createValidator(v => !/[\u4e00-\u9fa5]/.test(v), 'form.validation.noChinese')
    }
  }
}
