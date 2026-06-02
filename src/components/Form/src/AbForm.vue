<script lang="tsx">
import { computed, defineComponent, onBeforeUnmount, onMounted, toRaw, unref, watch } from 'vue'
import { abFormProps } from './props'
import { useForm } from './hook/useForm'
import { useImport } from './hook/useImport'
import { useRenderAnchor } from './render/useRenderAnchor'
import { useRenderForm } from './render/useRenderForm'
import { isObject } from '@/utils/is'
import type { FormProps, FormSchema } from './types'

export default defineComponent({
  name: 'AbForm',
  props: abFormProps,
  emits: ['register', 'update:stepValue', 'init', 'change', 'update:model'],
  setup(rawProps, { emit, attrs, slots, expose }) {
    const props = rawProps as unknown as FormProps
    const { components, arrayStrategies, componentConfigs } = useImport(props.imports)

    if (props.controlled && !isObject(props.model)) {
      emit('update:model', {})
    }

    const {
      isValidating,
      formModel,
      formRef,
      baseRowRef,
      componentRefs,
      initValues,
      getDefaultModel,
      getFormModel,
      getFormRef,
      setValues,
      clearValues,
      setValue,
      delValue,
      resetValidate,
      validate,
      scrollToKey
    } = useForm(props, emit as any, components.value, arrayStrategies.value)

    onMounted(() => {
      emit('register', formRef.value)
      if (!props.controlled) {
        props.autoInitField ? initValues(props.model) : setValues(props.model)
      } else if (props.autoInitField) {
        const initializedModel = getDefaultModel(props.model)
        emit('update:model', { ...initializedModel })
      }
      emit('init', formModel.value)
    })

    onBeforeUnmount(() => {
      if (!props.controlled) {
        formModel.value = {}
      }
      formRef.value = undefined
    })

    const schemasFieldsHash = computed(() => {
      const rawSchemas = toRaw(props.schemas)
      const extractFieldInfo = (schema: FormSchema): string => {
        const { key, field, type, component, value, children } = schema
        let info = `${field || key}:${type || 'Inputer'}:${component || ''}:${value !== undefined ? 'hasValue' : 'noValue'}`
        if (children && Array.isArray(children)) {
          info += `:children[${children.length}:${children.map(child => child.key || child.field).join(',')}]`
        }
        return info
      }
      return rawSchemas.map(extractFieldInfo).join('|')
    })

    watch(
      schemasFieldsHash,
      () => {
        if (isValidating.value) return
        if (!props.controlled) {
          props.autoInitField && initValues(unref(formModel))
        } else if (props.autoInitField) {
          const initializedModel = getDefaultModel(props.model)
          emit('update:model', { ...initializedModel, ...props.model })
        }
        resetValidate()
      },
      { immediate: false }
    )

    expose({
      initValues,
      getDefaultModel,
      getFormModel,
      getFormRef,
      setValues,
      clearValues,
      setValue,
      delValue,
      validate,
      resetValidate,
      scrollToKey
    })

    const { renderForm } = useRenderForm(
      props,
      emit as any,
      attrs,
      slots as any,
      formModel as any,
      formRef,
      componentRefs,
      baseRowRef,
      components.value,
      componentConfigs.value
    )
    const { renderAnchor } = useRenderAnchor(props, formModel as any)

    return () => (
      <div class="ab-form">
        {props.anchor && renderAnchor()}
        {renderForm()}
      </div>
    )
  }
})
</script>

<style lang="less">
.ab-form {
  width: 100%;

  .ab-form-main {
    width: 100%;
  }

  .ab-form-main__base-row,
  .ab-form-main__container-row {
    width: 100%;
  }

  .ab-form-item-outside {
    gap: 8px;
  }

  .ab-form-item-is-disabled {
    .arco-form-item-message,
    .arco-form-item-extra {
      color: var(--color-text-4);
    }

    .arco-form-item-label-col > .arco-form-item-label {
      font-size: var(--ab-form-disabled-label-font-size);
    }

    &.ab-form-item-disabled-default-cursor {
      &,
      * {
        cursor: default !important;
      }
    }

    &.ab-form-item-disabled-no-padding {
      .arco-input-wrapper,
      .arco-input-tag,
      .arco-select-view,
      .arco-picker,
      .arco-color-picker {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .arco-input,
      .arco-input-tag-input,
      .arco-select-view-input,
      .arco-picker input,
      .arco-textarea {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }

    &.ab-form-item-disabled-no-suffix {
      .arco-select-view-suffix,
      .arco-picker-suffix {
        display: none !important;
      }

      .arco-select-view,
      .arco-picker {
        padding-right: 0 !important;
      }
    }
  }
}
</style>
