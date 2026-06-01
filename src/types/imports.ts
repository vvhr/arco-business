import type { Component } from 'vue'

export interface FormImportItemConfig {
  /**
   * 组件的 modelValue 键名
   */
  modelValueKey?: string
  /**
   * 是否需要自动添加 allowClear 属性
   */
  needAllowClear?: boolean
  /**
   * 是否需要自动添加 input placeholder 属性
   */
  needInputPlaceholder?: boolean
  /**
   * 是否需要自动添加 select placeholder 属性
   */
  needSelectPlaceholder?: boolean
  /**
   * 是否需要自动添加 options 属性
   */
  needOptions?: boolean
  /**
   * options 透传给组件时使用的属性名
   */
  optionsPropName?: 'options' | 'data'
}

export interface FormImportItem {
  name: string
  component: Component
  config?: FormImportItemConfig
  isArrayFn?: (cps: Recordable) => boolean
}

export interface TableFormImportItemConfig {
  /**
   * 组件的modelValue键名
   */
  modelValueKey?: string
  /**
   * 是否需要自动添加input placeholder属性
   */
  needInputPlaceholder?: boolean
  /**
   * 是否需要自动添加select placeholder属性
   */
  needSelectPlaceholder?: boolean
}

export interface TableFormImportItem {
  name: string
  component: Component
  config?: TableFormImportItemConfig
  isArrayFn?: (cps: Recordable) => boolean
}
