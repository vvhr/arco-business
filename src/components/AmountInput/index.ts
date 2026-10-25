import AmountInput from './src/AmountInput.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AbAmountInput: SFCWithInstall<typeof AmountInput> = withInstall(AmountInput)
export default AbAmountInput
export type {
  AmountInputProps,
  AmountInputEmits,
  AmountModelValue,
  AmountEmptyValue,
  NormalizedAmountInputResult
} from './src/types'
export * from './src/utils'
