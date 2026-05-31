import type { ModalConfig as ArcoModalConfig } from '@arco-design/web-vue'
import type { CSSProperties } from 'vue'

export type DoneFn = () => void
export type BeforeCloseFn = (done: DoneFn) => void

export type ScrollToOptions =
  | number
  | {
      left?: number | undefined
      top?: number | undefined
    }
  | undefined

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

type StyleValue = string | CSSProperties

type ModalComponentConfig = Partial<ArcoModalConfig> & {
  visible?: boolean
  defaultVisible?: boolean
  unmountOnClose?: boolean
}

export type ModalConfig = Omit<ModalComponentConfig, ModalConfigExcludeKeys>

export interface ModalProps extends ModalConfig {
  /**
   * acro-design 实际为 visible，为保持系统统一性，使用 modelValue。
   */
  modelValue?: boolean
  /**
   * 默认标题文字。
   */
  title?: string
  /**
   * 是否隐藏标题。
   */
  hideTitle?: boolean
  /**
   * 是否默认开启全屏。
   */
  fullscreen?: boolean
  /**
   * 显示全屏切换按钮。
   */
  showFullscreen?: boolean
  /**
   * 是否使用内置滚动条。
   */
  scrollable?: boolean
  /**
   * 使用内置滚动条时必须给滚动条设置一个最大高度。
   */
  scrollbarHeight?: string | number
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
  bodyStyle?: StyleValue
}
