import Drawer from './src/Drawer.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'
import type { DrawerProps } from './src/types.ts'

export const AbDrawer: SFCWithInstall<typeof Drawer> = withInstall(Drawer)
export default AbDrawer

/**
 * Drawer 组件的 Props 类型定义
 * 继承 arco-drawer 的所有原生属性，并扩展自定义属性
 */
export { DrawerProps }

/**
 * Drawer 组件实例类型
 */
export type DrawerInstance = InstanceType<typeof Drawer>

/**
 * Drawer 组件的 Emits 类型定义
 */
export type DrawerEmits = InstanceType<typeof Drawer>['$emit']

/**
 * Drawer 组件的 Slots 类型定义
 */
export type DrawerSlots = {
  /** 标题插槽 */
  title?: () => any
  /** 标题栏操作按钮插槽 */
  'header-actions'?: () => any
  /** 内容插槽 */
  default?: () => any
  /** 底部插槽 */
  footer?: () => any
}
