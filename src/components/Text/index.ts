import Text from './src/Text'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AbText: SFCWithInstall<typeof Text> = withInstall(Text)
export default AbText

export type {
  TextProps,
  TextEmits,
  TextStatus,
  DotStatus,
  DotType,
  DotSize,
  HighlightPatterns,
  BlockStatus
} from './src/types'
