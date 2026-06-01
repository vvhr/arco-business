import type { Component, ComputedRef, Ref, VNode } from 'vue'
import { resolveDirective, withDirectives } from 'vue'
import { Form, FormItem, Row } from '@arco-design/web-vue'
import type {
  AbFormComponentName,
  AbFormComponentProps,
  AbFormEmits,
  AbFormImportItemConfig,
  AbFormProps,
  AbFormRawInstance,
  AbFormSchema,
  AbFormSlots
} from '../types'
import { componentsNeedingRef, SchemaType } from '../constants'
import { useFormItem } from '../hook/useFormItem'
import { useComponent } from '../hook/useComponent'
import { SchemaLayout } from './SchemaLayout'
import { getSlot } from '@/utils/get'
import { isExistAttr, isFunction } from '@/utils/is'
import { isHidden } from '../utils'
import { logger } from '@/locale'

const applyDirectives = (vnode: any, directivesObj: Record<string, any>) => {
  if (!directivesObj || Object.keys(directivesObj).length === 0) {
    return vnode
  }
  const directiveBindings = Object.entries(directivesObj)
    .map(([key, value]) => {
      const directiveName = key.replace(/^v-/, '')
      const directive = resolveDirective(directiveName)
      return directive ? [directive, value] : null
    })
    .filter(Boolean)
  return directiveBindings.length > 0 ? withDirectives(vnode, directiveBindings as any) : vnode
}

export function useRenderForm(
  props: AbFormProps,
  emits: AbFormEmits,
  attrs: any,
  slots: AbFormSlots,
  formModel: Ref<Recordable>,
  formRef: Ref<AbFormRawInstance | undefined>,
  componentRefs: Ref<Recordable<ComponentRef<any>>>,
  baseRowRef: Ref<any>,
  components: Partial<Recordable<Component, AbFormComponentName>>,
  componentConfigs: Partial<Recordable<AbFormImportItemConfig, AbFormComponentName>>
) {
  function renderContainer(
    schema: AbFormSchema,
    componentProps: AbFormComponentProps,
    defaultRender?: () => VNode | undefined
  ): VNode | undefined {
    if (!schema.component || !isExistAttr(components, schema.component)) {
      logger.error('console.form.componentNotExist', { type: SchemaType.CONTAINER, component: schema.component }, schema)
      return undefined
    }
    const { getAnyComponent, freshKey, setComponentProps } = useComponent(
      props,
      slots,
      emits,
      schema,
      formModel,
      componentProps,
      components,
      componentConfigs
    )
    const AnyComponent = getAnyComponent()
    if (!AnyComponent) {
      logger.error('console.form.componentError', { type: SchemaType.CONTAINER, component: schema.component }, schema)
      return undefined
    }
    return (
      <AnyComponent {...setComponentProps()} key={freshKey}>
        {{ default: () => defaultRender?.() }}
      </AnyComponent>
    )
  }

  function renderDecorator(schema: AbFormSchema, componentProps: AbFormComponentProps): VNode | undefined {
    if (!schema.component || !isExistAttr(components, schema.component)) {
      logger.error('console.form.componentNotExist', { type: SchemaType.DECORATOR, component: schema.component }, schema)
      return undefined
    }
    const {
      enableOutside,
      setOutsideAppend,
      setOutsidePrepend,
      getAnyComponent,
      freshKey,
      setComponentProps,
      setComponentEvent
    } = useComponent(props, slots, emits, schema, formModel, componentProps, components, componentConfigs)
    const renderAnyComponent = () => {
      const AnyComponent = getAnyComponent()
      if (!AnyComponent) {
        logger.error('console.form.componentError', { type: SchemaType.DECORATOR, component: schema.component }, schema)
        return undefined
      }
      return (
        <AnyComponent {...setComponentProps()} {...setComponentEvent()} key={freshKey}>
          {{ ...useFormItem(props, slots, schema, formModel).getInsideSlots() }}
        </AnyComponent>
      )
    }
    return enableOutside ? renderOutside(schema, renderAnyComponent, setOutsidePrepend, setOutsideAppend) : renderAnyComponent()
  }

  function renderInputer(
    schema: AbFormSchema,
    componentProps: AbFormComponentProps,
    disabled: ComputedRef<boolean>
  ): VNode | undefined {
    if (!schema.component || !isExistAttr(components, schema.component)) {
      logger.error('console.form.componentNotExist', { type: SchemaType.INPUTER, component: schema.component }, schema)
      return undefined
    }
    const {
      enableOutside,
      setOutsideAppend,
      setOutsidePrepend,
      getAnyComponent,
      freshKey,
      setModelValue,
      setComponentEvent,
      setComponentProps
    } = useComponent(
      props,
      slots,
      emits,
      schema,
      formModel,
      componentProps,
      components,
      componentConfigs,
      disabled
    )
    const { getInsideSlots } = useFormItem(props, slots, schema, formModel)
    const setComponentRef = (el: any) => {
      const refKey = schema.key || schema.field || ''
      if (el && refKey && componentsNeedingRef.includes(schema.component as any)) {
        componentRefs.value[`${refKey}Ref`] = el
      }
    }
    const renderAnyComponent = () => {
      const AnyComponent = getAnyComponent()
      if (!AnyComponent) {
        logger.error('console.form.componentError', { type: SchemaType.INPUTER, component: schema.component }, schema)
        return undefined
      }
      return (
        <AnyComponent
          ref={(el: any) => setComponentRef(el)}
          {...setModelValue()}
          {...setComponentProps()}
          {...setComponentEvent()}
          disabled={disabled.value}
          key={freshKey}
        >
          {{ ...getInsideSlots() }}
        </AnyComponent>
      )
    }
    return enableOutside ? renderOutside(schema, renderAnyComponent, setOutsidePrepend, setOutsideAppend) : renderAnyComponent()
  }

  function renderOutside(
    schema: AbFormSchema,
    renderAnyComponent: () => VNode | undefined,
    setOutsidePrepend: () => any,
    setOutsideAppend: () => any
  ) {
    const direction = schema.outsideProps?.direction || 'row'
    const style: Recordable = {
      display: 'flex',
      flexDirection: direction,
      flexWrap: 'wrap',
      alignItems: direction === 'row' ? 'center' : 'flex-start',
      width: '100%',
      ...(schema.outsideProps?.style || {})
    }
    return (
      <div class="ab-form-item-outside" style={style}>
        {setOutsidePrepend()}
        {renderAnyComponent()}
        {setOutsideAppend()}
      </div>
    )
  }

  function renderCustom(schema: AbFormSchema): VNode | undefined {
    if (schema.type === SchemaType.CUSTOM) {
      if (isFunction(schema.render)) {
        return schema.render(formModel.value, schema, props.disabled, props.excontext)
      }
      const slotKey = (schema.key || schema.field || '').replace(/\./g, '-')
      if (slots[slotKey]) {
        return getSlot(slots, slotKey, formModel.value) as any
      }
    }
    logger.error('console.form.customComponentError', undefined, schema)
    return undefined
  }

  function renderSchema(schema: AbFormSchema) {
    const hidden = isHidden(schema, formModel.value, props)
    if (hidden && !props.designable) {
      return undefined
    }
    const key = schema.key ?? schema.field
    if (!key) {
      logger.error('console.form.keyRequired', undefined, schema)
      return undefined
    }
    const type = schema.type ?? SchemaType.INPUTER
    switch (type) {
      case SchemaType.STEP:
        logger.error('console.form.nestedStepNotSupported', undefined, schema)
        return undefined
      case SchemaType.CUSTOM: {
        const { getFormItemProps, slotKey, getExtraSlot, getHelpSlot } = useFormItem(
          props,
          slots,
          schema,
          formModel
        )
        return (
          <SchemaLayout
            schema={schema}
            schemaProps={props.schemaProps}
            item-key={key}
            designable={props.designable}
            designableColProps={props.designableColProps}
            is-hidden={hidden}
          >
            {{
              default: () => (
                <FormItem {...getFormItemProps()}>
                  {{
                    ...(slots[`${slotKey}--label`] ? { label: slots[`${slotKey}--label`] } : {}),
                    ...(slots[`${slotKey}--error`] ? { error: slots[`${slotKey}--error`] } : {}),
                    ...(getExtraSlot() ? { extra: getExtraSlot() } : {}),
                    ...(getHelpSlot() ? { help: getHelpSlot() } : {}),
                    default: () => renderCustom(schema)
                  }}
                </FormItem>
              ),
              ...(props.designable && {
                design: (column: AbFormSchema) => slots.design?.(column)
              })
            }}
          </SchemaLayout>
        )
      }
      case SchemaType.CONTAINER: {
        const { trueComponentProps } = useFormItem(props, slots, schema, formModel)
        const useDesignable = props.designable
        const containerRowDirectives = useDesignable ? props.designableDirectives?.containerRow || {} : {}
        const rowKey =
          containerRowDirectives && Object.keys(containerRowDirectives).length > 0
            ? `container-row-${key}-designable`
            : `container-row-${key}`
        const renderContainerBaseRow = () => (
          <Row
            class={{
              'ab-form-main__container-row': true,
              'is-designable': props.designable
            }}
            data-id={`container-row-${key}`}
            key={rowKey}
            gutter={10}
          >
            {schema.children ? schema.children.map(item => renderSchema(item)) : undefined}
          </Row>
        )
        return (
          <SchemaLayout
            schema={schema}
            schemaProps={props.schemaProps}
            item-key={key}
            designable={props.designable}
            designableColProps={props.designableColProps}
            is-hidden={hidden}
          >
            {{
              default: () =>
                renderContainer(
                  schema,
                  trueComponentProps,
                  () =>
                    useDesignable
                      ? applyDirectives(renderContainerBaseRow(), containerRowDirectives)
                      : renderContainerBaseRow()
                ),
              ...(props.designable && {
                design: (column: AbFormSchema) => slots.design?.(column)
              })
            }}
          </SchemaLayout>
        )
      }
      case SchemaType.DECORATOR: {
        const { trueComponentProps } = useFormItem(props, slots, schema, formModel)
        return (
          <SchemaLayout
            schema={schema}
            schemaProps={props.schemaProps}
            item-key={key}
            designable={props.designable}
            designableColProps={props.designableColProps}
            is-hidden={hidden}
          >
            {{
              default: () => renderDecorator(schema, trueComponentProps),
              ...(props.designable && {
                design: (column: AbFormSchema) => slots.design?.(column)
              })
            }}
          </SchemaLayout>
        )
      }
      case SchemaType.INPUTER:
      default: {
        const {
          trueComponentProps,
          isDisabled,
          getFormItemProps,
          slotKey,
          getExtraSlot,
          getHelpSlot
        } = useFormItem(props, slots, schema, formModel)
        return (
          <SchemaLayout
            schema={schema}
            schemaProps={props.schemaProps}
            item-key={key}
            designable={props.designable}
            designableColProps={props.designableColProps}
            is-hidden={hidden}
          >
            {{
              default: () => (
                <FormItem {...getFormItemProps()}>
                  {{
                    ...(slots[`${slotKey}--label`] ? { label: slots[`${slotKey}--label`] } : {}),
                    ...(slots[`${slotKey}--error`] ? { error: slots[`${slotKey}--error`] } : {}),
                    ...(getExtraSlot() ? { extra: getExtraSlot() } : {}),
                    ...(getHelpSlot() ? { help: getHelpSlot() } : {}),
                    default: () => renderInputer(schema, trueComponentProps, isDisabled)
                  }}
                </FormItem>
              ),
              ...(props.designable && {
                design: (column: AbFormSchema) => slots.design?.(column)
              })
            }}
          </SchemaLayout>
        )
      }
    }
  }

  function renderForm() {
    const filterStepSchemas = (schemas: AbFormSchema[]): AbFormSchema[] => {
      if (props.stepValue !== null) {
        const stepSchema = schemas.find(
          schema => schema.type === SchemaType.STEP && schema.step === props.stepValue
        )
        return stepSchema ? stepSchema.children || [] : []
      }
      return schemas
    }
    const currentSchemas = filterStepSchemas(props.schemas)
    const baseRowDirectives = props.designable ? props.designableDirectives?.baseRow || {} : {}
    const rowKey =
      props.designable && Object.keys(baseRowDirectives).length > 0 ? 'base-row-designable' : 'base-row'
    const renderBaseRow = () => (
      <Row
        ref={(el: any) => {
          baseRowRef.value = el
        }}
        data-id="base-row"
        key={rowKey}
        class={{
          'ab-form-main__base-row': true,
          'is-designable': props.designable
        }}
        gutter={10}
      >
        {currentSchemas.map(item => renderSchema(item))}
      </Row>
    )

    const formProps = getFormProps()
    return (
      <Form
        class={{ 'ab-form-main': true, 'is-designable': props.designable }}
        ref={(el: any) => {
          formRef.value = el
        }}
        {...formProps}
        model={formModel.value}
      >
        {{
          default: () =>
            props.designable ? applyDirectives(renderBaseRow(), baseRowDirectives) : renderBaseRow()
        }}
      </Form>
    )
  }

  function getFormProps() {
    const formProps = { ...attrs }
    const controlledKeys = [
      'model',
      'layout',
      'labelAlign',
      'disabled',
      'rules',
      'autoLabelWidth',
      'id',
      'scrollToFirstError',
      'labelColFlex',
      ['lab', 'align'].join('-'),
      ['auto', 'lab', 'width'].join('-'),
      ['scroll', 'to', 'first', 'error'].join('-'),
      ['lab', 'col', 'flex'].join('-')
    ]
    controlledKeys.forEach(key => {
      delete formProps[key]
    })
    return {
      ...formProps,
      size: props.size,
      layout: props.layout,
      labelAlign: props.labelAlign,
      labelColProps: props.labelColProps,
      wrapperColProps: props.wrapperColProps,
      labelColStyle: props.labelColStyle,
      wrapperColStyle: props.wrapperColStyle
    }
  }

  return {
    renderForm
  }
}
