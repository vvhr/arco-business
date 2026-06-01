import ComboInput from './src/ComboInput'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AbComboInput: SFCWithInstall<typeof ComboInput> = withInstall(ComboInput)
export default AbComboInput

export type { ComboInputProps, ComboInputEmits, ComboTemplate } from './src/types'
