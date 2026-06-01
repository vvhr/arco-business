import { computed, defineComponent, type PropType } from 'vue'
import { Col, Row } from '@arco-design/web-vue'
import type { AbFormDesignableColProps, AbFormSchema, AbFormSchemaProps } from '../types'

export const SchemaLayout = defineComponent({
  name: 'AbFormSchemaLayout',
  props: {
    schema: {
      type: Object as PropType<AbFormSchema>,
      required: true
    },
    schemaProps: {
      type: Object as PropType<AbFormSchemaProps>,
      required: true
    },
    itemKey: {
      type: String,
      required: true
    },
    designable: {
      type: Boolean,
      default: false
    },
    designableColProps: {
      type: Function as PropType<AbFormDesignableColProps>,
      default: () => ({})
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    const layoutProps = computed(() => {
      return {
        span: props.schema.layoutProps?.span ?? props.schemaProps?.layoutProps?.span ?? 12,
        alone: props.schema.layoutProps?.alone ?? props.schemaProps?.layoutProps?.alone ?? false,
        style: props.schema.layoutProps?.colStyle ?? {}
      }
    })
    const type = computed(() => props.schema.type ?? 'Inputer')
    const enableAlone = ['Container', 'Custom', 'Inputer', 'Decorator']

    return () => {
      const designableColProps = props.designable
        ? { ...(props.designableColProps?.(props.itemKey, props.schema, props.isHidden) || {}) }
        : {}
      if (layoutProps.value.alone && enableAlone.includes(type.value)) {
        return (
          <Col
            class="mb-2"
            {...designableColProps}
            span={24}
            key={props.itemKey}
            data-id={props.itemKey}
            id={props.itemKey}
          >
            <Row>
              <Col span={layoutProps.value.span} style={layoutProps.value.style}>
                {slots.default?.()}
              </Col>
            </Row>
            {props.designable ? slots.design?.(props.schema) : undefined}
          </Col>
        )
      }
      return (
        <Col
          class="mb-2"
          {...designableColProps}
          span={layoutProps.value.span}
          key={props.itemKey}
          data-id={props.itemKey}
          id={props.itemKey}
          style={layoutProps.value.style}
        >
          {slots.default?.()}
          {props.designable ? slots.design?.(props.schema) : undefined}
        </Col>
      )
    }
  }
})
