// 选项用途
export type Useful = 'read' | 'edit'

export type DictItemValue = string | number | boolean | null

export type DictItem = {
  label: string
  value: DictItemValue
  disabled?: boolean
  hidden?: boolean
  useful?: Useful[]
  children?: DictItem[]
  // 标签渲染属性
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | ''
  color?: string // 定义颜色样式
  icon?: string // 定义图标(仅支持 iconify 图标)
  hit?: boolean
  effect?: 'dark' | 'light' | 'plain'
  round?: boolean
}

export type DictMap = Record<string, DictItem[]>
