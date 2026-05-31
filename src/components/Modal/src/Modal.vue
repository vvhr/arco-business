<script setup lang="ts">
import { Modal, Scrollbar } from '@arco-design/web-vue'
import { computed, useAttrs, ref, unref, useSlots } from 'vue'
import { isNumber } from '@/utils/is'
import { Icon } from '@/components/Icon'
import type { ModalProps, ScrollToOptions } from './types'

defineOptions({
  name: 'AbModal',
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

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  title: '',
  hideTitle: false,
  width: '500px',
  mask: true,
  unmountOnClose: true,
  maskClosable: true,
  renderToBody: true,
  modalClass: '',
  bodyClass: '',
  escToClose: false,
  draggable: false,
  fullscreen: false,
  showFullscreen: false,
  scrollable: false,
  alignCenter: true,
  scrollbarHeight: '400px',
  scrollbarType: 'embed',
  scrollbarOuterClass: '',
  scrollbarOuterStyle: ''
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

// 批量绑定属性给modal排除不需要的属性
const getBindValue = computed(() => {
  const delArr: string[] = [
    // 排除modalValue 由 visible 替代
    'modelValue',
    'visible',
    'defaultVisible',
    'default-visible',
    // 排除透传全屏,因为内部控制切换
    'fullscreen',
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
    'simple',
    'titleAlign',
    'title-align',
    // 排除扩展属性
    'showFullscreen',
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
    // 不允许居中标题
    titleAlign: 'start',
    // 不显示关闭按钮, 因为我们要自建标题栏
    closable: false,
    // 隐藏取消按钮, 因为我们要自建尾部栏
    hideCancel: true,
    // 最外层Class始终绑定我们的固定类名
    class: mergeClassName('ab-modal-overlay', obj.class),
    modalClass: mergeClassName('ab-modal', obj.modalClass),
    //
    footer: slots.footer ? true : false
  }
})
const scrollbarRef = ref()

const fullscreenLocal = ref(props.fullscreen)

const toggleFull = () => {
  fullscreenLocal.value = !unref(fullscreenLocal)
}

const scrollbarStyle = computed(() => {
  const height = isNumber(props.scrollbarHeight)
    ? `${props.scrollbarHeight}px`
    : props.scrollbarHeight
  return {
    height: height,
    padding: 'var(--size-4)',
    overflowY: 'auto'
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

function onScroll() {
  emit('scroll')
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
  <Modal
    v-bind="getBindValue"
    v-model:visible="visible"
    :fullscreen="fullscreenLocal"
    @open.prevent.stop="onOpen"
    @close.prevent.stop="onClose"
  >
    <template v-if="!hideTitle" #title>
      <div class="flex justify-between items-center relative w-full">
        <div class="flex items-center">
          <Icon v-if="draggable" icon="mdi:drag" class="ab-modal-draggable-indicator" :size="30" />
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div class="flex flex-row items-center gap-1">
          <slot name="header-actions"></slot>
          <div v-if="showFullscreen" class="ab-modal-btn" @click="toggleFull">
            <Icon
              :icon="
                fullscreenLocal ? 'radix-icons:exit-full-screen' : 'radix-icons:enter-full-screen'
              "
            />
          </div>
          <div class="ab-modal-btn" @click="handleClose()">
            <Icon icon="ep:close" />
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
    <div v-else class="ab-modal-body__no-scrollbar">
      <slot></slot>
    </div>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </Modal>
</template>

<style lang="less">
.ab-modal-overlay {
  .ab-modal {
    &.arco-modal-fullscreen {
      > .arco-modal-body {
        flex: 1;
        height: 0;
        > .ab-modal-body__no-scrollbar {
          height: 100%;
        }
        > .arco-scrollbar-type-embed {
          height: 100%;
          > .arco-scrollbar-container {
            height: 100% !important;
          }
        }
      }
    }
    &.arco-modal-draggable {
      > .arco-modal-header {
        cursor: auto;
        pointer-events: none;
      }
    }
    > .arco-modal-header {
      padding: 0 16px;
      .ab-modal-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: var(--color-text-1);
        font-size: 16px;
        height: 24px;
        width: 24px;
        cursor: pointer;
        border-radius: var(--border-radius-small);
        transition: all 150ms ease-in-out;
        background-color: transparent;
        pointer-events: all;
        &:hover {
          background-color: var(--color-fill-2);
        }
      }
      .ab-modal-draggable-indicator {
        color: var(--color-text-3);
        cursor: move;
        opacity: 0.8;
        transition: opacity 0.2s ease;
        margin-right: 5px;
        pointer-events: all;
        &:hover {
          opacity: 1;
        }
      }
    }
    > .arco-modal-body {
      padding: 0;
      overflow: hidden;
      > .ab-modal-body__no-scrollbar {
        padding: 12px 10px;
        box-sizing: border-box;
      }
    }
    > .arco-modal-footer {
      padding: 10px 16px;
    }
  }
}
</style>
