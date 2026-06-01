import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'

/**
 * 文本状态
 */
export type TextStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/**
 * 圆点状态
 */
export type DotStatus = '' | TextStatus

/**
 * 圆点样式类型
 */
export type DotType = 'plain' | 'shadow'

/**
 * 圆点尺寸
 */
export type DotSize = 'mini' | 'small' | 'medium' | 'large'

/**
 * 引用块状态
 */
export type BlockStatus = TextStatus

/**
 * 高亮匹配配置
 */
export type HighlightPatterns = string[] | string

/**
 * AbText 组件的 Props 定义
 */
export const textProps = {
  /**
   * 完整文本内容
   */
  value: {
    type: String,
    default: ''
  },
  /**
   * 前置图标 (iconify图标类:图标名称)
   */
  icon: {
    type: String,
    default: ''
  },
  /**
   * 图标样式类
   */
  iconClass: {
    type: String,
    default: ''
  },
  /**
   * 图标样式
   */
  iconStyle: {
    type: [String, Object] as PropType<string | CSSProperties>,
    default: ''
  },
  /**
   * 圆点状态 (为空时不显示)
   */
  dotStatus: {
    type: String as PropType<DotStatus>,
    default: ''
  },
  /**
   * 圆点样式类型：plain 无阴影，shadow 有阴影
   */
  dotType: {
    type: String as PropType<DotType>,
    default: 'plain'
  },
  /**
   * 圆点尺寸
   */
  dotSize: {
    type: String as PropType<DotSize>,
    default: 'medium'
  },
  /**
   * 引用块左侧边框状态
   */
  blockStatus: {
    type: String as PropType<BlockStatus>,
    default: 'primary'
  },
  /**
   * 文本字号，不设置时继承父级
   */
  fontSize: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  /**
   * 使用引用块样式
   */
  block: {
    type: Boolean,
    default: false
  },
  /**
   * 高亮文本数组，或使用英文逗号分隔的字符串
   */
  patterns: {
    type: [Array, String] as PropType<HighlightPatterns>,
    default: () => []
  },
  /**
   * 高亮元素类
   */
  hlClass: {
    type: String,
    default: ''
  },
  /**
   * 高亮元素样式
   */
  hlStyle: {
    type: [String, Object] as PropType<string | CSSProperties>,
    default: ''
  },
  /**
   * 文本截断（true 或行数）
   */
  truncate: {
    type: [Boolean, Number] as PropType<boolean | number>,
    default: false
  },
  /**
   * 是否可展开
   */
  expandable: {
    type: Boolean,
    default: false
  },
  /**
   * 展开按钮文案
   */
  expandText: {
    type: String,
    default: ''
  },
  /**
   * 收起按钮文案
   */
  collapseText: {
    type: String,
    default: ''
  },
  /**
   * 是否可复制
   */
  copyable: {
    type: Boolean,
    default: false
  },
  /**
   * 复制图标
   */
  copyIcon: {
    type: String,
    default: 'icon-park-outline:copy'
  },
  /**
   * 复制成功提示
   */
  copySuccessText: {
    type: String,
    default: ''
  }
} as const

/**
 * AbText 组件的 Props 类型
 */
export type TextProps = ExtractPropTypes<typeof textProps>

/**
 * AbText 组件的 Emits 定义
 */
export const textEmits = {
  /**
   * 高亮元素被点击
   * @param value 高亮内容
   */
  hlClick: (value: string) => typeof value === 'string',
  /**
   * 复制成功事件
   * @param text 复制的文本
   */
  copy: (text: string) => typeof text === 'string'
}

/**
 * AbText 组件的 Emits 类型
 */
export type TextEmits = typeof textEmits
