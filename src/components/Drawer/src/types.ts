import type { CSSProperties } from 'vue'
import type { DrawerConfig as ArcoDrawerConfig } from '@arco-design/web-vue'

export type DoneFn = () => void
export type BeforeCloseFn = (done: DoneFn) => void

export type ScrollToOptions =
  | number
  | {
      left?: number | undefined
      top?: number | undefined
    }
  | undefined

type StyleValue = string | CSSProperties

type ModalConfigExcludeKeys =
  | 'closable'
  | 'hideCancel'
  | 'onBeforeOk'
  | 'onBeforeCancel'
  | 'footer'
  | 'okLoading'
  | 'okButtonProps'
  | 'cancelButtonProps'
  | 'cancelText'
  | 'okText'
  | 'simple'
  | 'visible'
  | 'defaultVisible'
  | 'bodyStyle'

type DrawerComponentConfig = Partial<ArcoDrawerConfig> & {
  visible?: boolean
  defaultVisible?: boolean
  unmountOnClose?: boolean
}

export type DrawerConfig = Omit<DrawerComponentConfig, ModalConfigExcludeKeys>

export interface DrawerProps extends DrawerConfig {
  /**
   * acro-design 实际为 visible，为保持系统统一性，使用 modelValue。
   */
  modelValue?: boolean
  /**
   * 默认标题文字。
   */
  title?: string
  /**
   * 是否显示头部
   */
  header?: boolean
  /**
   * 抽屉位置
   */
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * 是否使用内置滚动条。
   */
  scrollable?: boolean
  /**
   * 滚动条属性。
   */
  scrollbarType?: 'track' | 'embed'
  /**
   * 滚动条外层类名。
   */
  scrollbarOuterClass?: string | Record<string, boolean> | any[]
  /**
   * 滚动条外层样式。
   */
  scrollbarOuterStyle?: StyleValue
  /**
   * 关闭前回调。
   */
  beforeClose?: BeforeCloseFn
  // 避免触发boolean错误
  bodyStyle?: StyleValue
}
