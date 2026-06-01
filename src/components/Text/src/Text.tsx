import { computed, defineComponent, h, ref, type VNode } from 'vue'
import { textProps, textEmits } from './types'
import type { HighlightPatterns } from './types'
import { AbIcon } from '@/components/Icon'
import { Message } from '@arco-design/web-vue'
import { t } from '@/locale'
import './text.less'

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizePatterns(patterns: HighlightPatterns): string[] {
  if (typeof patterns === 'string') {
    return patterns
      .split(',')
      .map(pattern => pattern.trim())
      .filter(Boolean)
  }
  return patterns
}

/**
 * 解析文本并生成高亮节点
 */
function parseHighlightText(
  text: string,
  patterns: string[],
  hlClass: string,
  hlStyle: string | Record<string, any>,
  onHlClick: (value: string) => void
): (string | VNode)[] {
  if (!patterns || patterns.length === 0 || !text) {
    return [text]
  }

  // 过滤空字符串并转义特殊字符
  const validPatterns = patterns.filter(p => p && p.trim()).map(p => escapeRegExp(p))

  if (validPatterns.length === 0) {
    return [text]
  }

  // 构建正则表达式，使用 | 连接所有 patterns
  const regex = new RegExp(`(${validPatterns.join('|')})`, 'g')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    // 检查是否为高亮部分
    if (part && validPatterns.some(pattern => new RegExp(`^${pattern}$`).test(part))) {
      return h(
        'span',
        {
          key: `hl-${index}`,
          class: ['ab-text__highlight', hlClass].filter(Boolean).join(' '),
          style: hlStyle,
          onClick: () => onHlClick(part)
        },
        part
      )
    }
    return part
  })
}

/**
 * 复制文本到剪贴板
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    }
  } catch {
    return false
  }
}

function normalizeFontSize(fontSize: string | number): string | undefined {
  if (fontSize === '') {
    return undefined
  }
  return typeof fontSize === 'number' ? `${fontSize}px` : fontSize
}

export default defineComponent({
  name: 'AbText',
  props: textProps,
  emits: textEmits,
  setup(props, { emit }) {
    // 是否展开状态
    const isExpanded = ref(false)

    // 计算高亮后的文本节点
    const contentNodes = computed(() => {
      return parseHighlightText(
        props.value,
        normalizePatterns(props.patterns),
        props.hlClass,
        props.hlStyle,
        (value: string) => emit('hlClick', value)
      )
    })

    // 处理复制
    const handleCopy = async () => {
      const success = await copyToClipboard(props.value)
      if (success) {
        Message.success(props.copySuccessText || t('text.copySuccess'))
        emit('copy', props.value)
      } else {
        Message.error(t('text.copyFailed'))
      }
    }

    // 切换展开/收起
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    return () => {
      const children: VNode[] = []

      // 渲染圆点
      if (props.dotStatus) {
        children.push(
          h('span', {
            key: 'dot',
            class: [
              'ab-text__dot',
              `ab-text__dot--${props.dotStatus}`,
              `ab-text__dot--${props.dotType}`,
              `ab-text__dot--${props.dotSize}`
            ]
          })
        )
      }

      // 渲染图标
      if (props.icon) {
        children.push(
          h(
            AbIcon,
            {
              key: 'icon',
              icon: props.icon,
              class: ['ab-text__icon', props.iconClass].filter(Boolean).join(' '),
              style: props.iconStyle
            },
            null
          )
        )
      }

      // 计算文本容器样式类
      const contentClass = ['ab-text__content']
      if (props.truncate && !isExpanded.value) {
        contentClass.push('ab-text__content--truncate')
      }

      // 计算文本容器样式
      const contentStyle: Record<string, any> = {}
      if (typeof props.truncate === 'number' && !isExpanded.value) {
        contentStyle['--ab-text-line-clamp'] = props.truncate
      }

      // 渲染文本内容
      children.push(
        h(
          'span',
          {
            key: 'content',
            class: contentClass,
            style: contentStyle
          },
          contentNodes.value
        )
      )

      // 渲染展开/收起按钮
      if (props.truncate && props.expandable) {
        children.push(
          h(
            'span',
            {
              key: 'expand',
              class: 'ab-text__expand',
              onClick: toggleExpand
            },
            isExpanded.value
              ? props.collapseText || t('text.collapse')
              : props.expandText || t('text.expand')
          )
        )
      }

      // 渲染复制按钮
      if (props.copyable) {
        children.push(
          h(
            AbIcon,
            {
              key: 'copy',
              icon: props.copyIcon,
              class: 'ab-text__copy',
              onClick: handleCopy
            },
            null
          )
        )
      }

      // 根据 block 属性决定使用的容器类
      const rootClass = [
        'ab-text',
        props.block ? 'ab-text--block' : 'ab-text--inline',
        props.block && props.blockStatus ? `ab-text--block-${props.blockStatus}` : ''
      ].filter(Boolean)
      const rootFontSize = normalizeFontSize(props.fontSize)

      return h(
        'div',
        { class: rootClass, style: rootFontSize ? { fontSize: rootFontSize } : undefined },
        children
      )
    }
  }
})
