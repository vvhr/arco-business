import Modal from './src/Modal.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'
import type { ModalProps } from './src/types.ts'

export const AbModal: SFCWithInstall<typeof Modal> = withInstall(Modal)
export default AbModal

/**
 * Modal 组件的 Props 类型定义
 * 继承 arco-modal 的所有原生属性，并扩展自定义属性
 */
export {
  ModalProps
}

/**
 * Modal 组件实例类型
 */
export type ModalInstance = InstanceType<typeof Modal>

/**
 * Modal 组件的 Emits 类型定义
 */
export type ModalEmits = InstanceType<typeof Modal>['$emit']

/**
 * Modal 组件的 Slots 类型定义
 */
export type ModalSlots = {
  /** 标题插槽 */
  title?: () => any
  /** 标题栏操作按钮插槽 */
  'header-actions'?: () => any
  /** 内容插槽 */
  default?: () => any
  /** 底部插槽 */
  footer?: () => any
}
