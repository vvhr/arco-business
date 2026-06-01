import type { Ref } from 'vue'
import { Anchor, AnchorLink } from '@arco-design/web-vue'
import { getLabel, isHidden } from '../utils'
import type { AbFormProps, AbFormSchema } from '../types'

export function useRenderAnchor(props: AbFormProps, formModel: Ref<Recordable>) {
  const shouldShowAnchor = (schema: AbFormSchema): boolean => {
    if (schema.anchorLinkProps?.enable === false) {
      return false
    }
    const type = schema.type ?? 'Inputer'
    const isDefaultAnchor = type === 'Container'
    const isExplicitAnchor = schema.anchorLinkProps?.enable === true
    if (!isDefaultAnchor && !isExplicitAnchor) {
      return false
    }
    return !isHidden(schema, formModel.value, props)
  }

  const renderAnchorLinks = (schemas: AbFormSchema[]) => {
    return schemas.filter(shouldShowAnchor).map(schema => {
      const itemKey = schema.key || schema.field || ''
      const title =
        schema.anchorLinkProps?.title || getLabel(schema, formModel.value, props) || itemKey
      const href = schema.anchorLinkProps?.href || `#${itemKey}`
      const hasChildren = schema.type === 'Container' && schema.children?.some(shouldShowAnchor)
      return (
        <AnchorLink key={itemKey} title={title} href={href}>
          {hasChildren && renderAnchorLinks(schema.children!)}
        </AnchorLink>
      )
    })
  }

  const renderAnchor = () => {
    if (!props.schemas || props.schemas.length < 1) {
      return undefined
    }
    const anchorProps = { ...props.anchorProps }
    if (!anchorProps.scrollContainer && props.scrollRef) {
      anchorProps.scrollContainer = props.scrollRef
    }
    const anchorStyle = {
      position: 'fixed',
      left: '20px',
      top: '100px',
      width: '120px',
      zIndex: 20,
      padding: '10px 10px 10px 0',
      background: 'var(--color-bg-1)',
      borderRadius: '4px',
      ...props.anchorAffixStyle
    }
    return (
      <div class="ab-form-anchor" style={anchorStyle}>
        <Anchor {...anchorProps}>{renderAnchorLinks(props.schemas)}</Anchor>
      </div>
    )
  }

  return {
    renderAnchor
  }
}
