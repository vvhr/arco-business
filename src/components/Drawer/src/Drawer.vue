<script setup lang="ts">
import { Drawer, Scrollbar } from '@arco-design/web-vue'
import { computed, useAttrs, useSlots } from 'vue'
import type { DrawerProps, ScrollToOptions } from './types'

defineOptions({
  name: 'AbDrawer',
  inheritAttrs: false
})

const slots = useSlots()

function mergeClassName(baseClass: string, className: unknown) {
  const classList = Array.isArray(className)
    ? className.flatMap(item => mergeClassName('', item))
    : className
      ? [className]
      : []

  return [baseClass, ...classList].filter(Boolean)
}

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  placement: 'right',
  title: '',
  header: true,
  width: '500px',
  height: '250px',
  mask: true,
  unmountOnClose: true,
  maskClosable: false,
  renderToBody: true,
  bodyClass: '',
  escToClose: false,
  scrollable: false,
  scrollbarType: 'embed',
  scrollbarOuterClass: '',
  scrollbarOuterStyle: 'height: 100%'
})
const emit = defineEmits(['update:modelValue', 'scroll', 'close', 'open'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
const getBindValue = computed(() => {
  const delArr: string[] = [
    // 排除modalValue 由 visible 替代
    'modelValue',
    'visible',
    'defaultVisible',
    'default-visible',
    // 排除标题, 因为内部构造标题栏
    'title',
    'closable',
    'hideCancel',
    'hide-cancel',
    'onBeforeOk',
    'on-before-ok',
    'onBeforeCancel',
    'on-before-cancel',
    'footer',
    'okLoading',
    'ok-loading',
    'okButtonProps',
    'ok-button-props',
    'cancelButtonProps',
    'cancel-button-props',
    'cancelText',
    'cancel-text',
    'okText',
    'ok-text',
    // 排除扩展属性
    'scrollable',
    'scrollbarHeight',
    'scrollbarType',
    'scrollbarOuterClass',
    'scrollbarOuterStyle',
    // 排除扩展属性
    'beforeClose'
  ]
  const attrs = useAttrs()
  const obj: any = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return {
    ...obj,
    // 不显示关闭按钮, 因为我们要自建标题栏
    closable: false,
    // 隐藏取消按钮, 因为我们要自建尾部栏
    hideCancel: true,
    // 最外层Class始终绑定我们的固定类名
    class: mergeClassName('ab-drawer-overlay', obj.class),
    // 是否有插槽
    footer: slots.footer ? true : false
  }
})

const scrollbarRef = ref()

const scrollbarStyle = computed(() => {
  return {
    height: '100%',
    padding: 'var(--size-4)',
    'overflow-y': 'auto',
    boxSizing: 'border-box'
  }
})

function handleClose() {
  if (props.beforeClose !== undefined) {
    props.beforeClose(() => {
      emit('update:modelValue', false)
    })
  } else {
    emit('update:modelValue', false)
  }
}

function onClose() {
  emit('close')
}
function onOpen() {
  emit('open')
}

function getScrollbarRef() {
  return scrollbarRef.value
}

function scrollTo(options?: ScrollToOptions, y?: number | undefined) {
  return scrollbarRef.value?.scrollTo(options, y)
}
function scrollTop(top: number) {
  return scrollbarRef.value?.scrollTop(top)
}
function scrollLeft(left: number) {
  return scrollbarRef.value?.scrollLeft(left)
}

defineExpose({
  getScrollbarRef,
  scrollTo,
  scrollTop,
  scrollLeft
})
</script>

<template>
  <Drawer
    v-bind="getBindValue"
    v-model:visible="visible"
    @open.prevent.stop="onOpen"
    @close.prevent.stop="onClose"
  >
    <template v-if="!!header" #header>
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center">
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div class="flex flex-row items-center gap-1">
          <slot name="header-actions"></slot>
          <div class="ab-drawer-btn" @click="handleClose()">
            <icon-close :size="16" />
          </div>
        </div>
      </div>
    </template>

    <Scrollbar
      v-if="scrollable"
      ref="scrollbarRef"
      :style="scrollbarStyle"
      :type="scrollbarType"
      :outer-class="scrollbarOuterClass"
      :outer-style="scrollbarOuterStyle"
      @scroll="onScroll"
    >
      <slot></slot>
    </Scrollbar>
    <div v-else class="ab-drawer-body__no-scrollbar">
      <slot></slot>
    </div>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </Drawer>
</template>
