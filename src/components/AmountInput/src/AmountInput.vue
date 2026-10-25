<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AmountInputEmits, AmountInputProps } from './types'
import {
  alignFractionDigits,
  formatDisplayValue,
  formatEditableValue,
  formatWithThousands,
  normalizeAmountInputValue,
  normalizeExternalAmountValue,
  toChineseUppercase
} from './utils'
import { Input as AInput } from '@arco-design/web-vue'
defineOptions({ name: 'AbAmountInput' })
const props = withDefaults(defineProps<AmountInputProps>(), {
  modelValue: null,
  emptyValue: null,
  placeholder: '',
  disabled: false,
  readonly: false,
  precision: 4,
  showChineseUppercase: true,
  uppercasePlaceholder: '',
  useThousandSeparatorInEdit: true,
  useThousandSeparatorInReadonly: true
})
const emit = defineEmits<AmountInputEmits>()
const isComposing = ref(false)
const displayValue = ref('')
let hasUserInput = false
let committedValue = ''
const comparableValue = (value: string) =>
  value ? alignFractionDigits(value, normalizedPrecision.value, true) : ''
const normalizedPrecision = computed(() => {
  const value = Number(props.precision)
  if (!Number.isFinite(value) || value < 0) return 4
  return Math.floor(value)
})
const normalizedModelValue = computed(() =>
  normalizeExternalAmountValue(props.modelValue, normalizedPrecision.value)
)
const readonlyDisplayValue = computed(() => {
  if (!normalizedModelValue.value) return ''
  return props.useThousandSeparatorInReadonly
    ? formatWithThousands(normalizedModelValue.value, normalizedPrecision.value, true)
    : alignFractionDigits(normalizedModelValue.value, normalizedPrecision.value, true)
})
const uppercaseText = computed(() => {
  if (!props.showChineseUppercase) return ''
  if (!normalizedModelValue.value) return props.uppercasePlaceholder
  return toChineseUppercase(normalizedModelValue.value, normalizedPrecision.value)
})
watch(
  [
    normalizedModelValue,
    normalizedPrecision,
    () => props.readonly,
    () => props.useThousandSeparatorInEdit,
    () => props.useThousandSeparatorInReadonly
  ],
  ([value, precision]) => {
    if (!hasUserInput) committedValue = comparableValue(value)
    displayValue.value = props.readonly
      ? formatDisplayValue(value, precision, props.useThousandSeparatorInReadonly)
      : formatEditableValue(value, precision, props.useThousandSeparatorInEdit)
  },
  { immediate: true }
)
function onInput(value: string) {
  if (props.readonly || props.disabled || isComposing.value) return
  hasUserInput = true
  const normalized = normalizeAmountInputValue(value, normalizedPrecision.value, props.emptyValue)
  displayValue.value = formatEditableValue(
    normalized.display,
    normalizedPrecision.value,
    props.useThousandSeparatorInEdit
  )
  emit('update:modelValue', normalized.output)
}
function onChange(value: string) {
  if (props.readonly || props.disabled) return
  const normalized = normalizeAmountInputValue(value, normalizedPrecision.value, props.emptyValue)
  displayValue.value = formatEditableValue(
    normalized.display,
    normalizedPrecision.value,
    props.useThousandSeparatorInEdit
  )
  const nextValue = comparableValue(normalized.normalized)
  const changed = hasUserInput && nextValue !== committedValue
  hasUserInput = false
  committedValue = nextValue
  emit('update:modelValue', normalized.output)
  if (changed) emit('change', normalized.output)
}
function onBlur(event: FocusEvent) {
  if (!props.readonly && !props.disabled) {
    const normalized = normalizeAmountInputValue(
      displayValue.value,
      normalizedPrecision.value,
      props.emptyValue
    )
    const normalizedValue = normalizeExternalAmountValue(
      normalized.output,
      normalizedPrecision.value
    )
    displayValue.value = formatEditableValue(
      normalizedValue,
      normalizedPrecision.value,
      props.useThousandSeparatorInEdit
    )
    emit('update:modelValue', normalized.output)
  }
  emit('blur', event)
}
function onFocus(event: FocusEvent) {
  if (!hasUserInput) committedValue = comparableValue(normalizedModelValue.value)
  emit('focus', event)
}
function onCompositionStart() {
  isComposing.value = true
}
function onCompositionEnd(event: CompositionEvent) {
  isComposing.value = false
  const target = event.target as HTMLInputElement | null
  if (!target) return
  onInput(target.value)
}
</script>
<template>
  <div class="amount-input">
    <a-input
      :model-value="readonly ? readonlyDisplayValue : displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :allow-clear="false"
      class="amount-input__control"
      inputmode="decimal"
      @update:model-value="onInput"
      @change="onChange"
      @blur="onBlur"
      @focus="onFocus"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    />
    <div
      v-if="
        showChineseUppercase && !readonly && !disabled && (uppercaseText || uppercasePlaceholder)
      "
      class="amount-input__uppercase"
      :class="{ 'is-placeholder': !normalizedModelValue }"
    >
      {{ uppercaseText || uppercasePlaceholder }}
    </div>
  </div>
</template>
<style scoped lang="less">
.amount-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  &__control {
    width: 100%;
  }
  &__uppercase {
    min-height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: var(--color-text-2);
    word-break: break-all;
    &.is-placeholder {
      color: var(--color-text-4);
    }
  }
}
</style>
