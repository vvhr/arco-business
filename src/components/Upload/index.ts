import Upload from './src/Upload.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AbUpload: SFCWithInstall<typeof Upload> = withInstall(Upload)
export default AbUpload

export type UploadDefineProps = InstanceType<typeof Upload>['$props']
export type UploadInstance = InstanceType<typeof Upload>
export type {
  UploadProps,
  UploadEmits,
  UploadFile,
  UploadRawFile,
  FileKeys,
  FileTemplate
} from './src/types'
