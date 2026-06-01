import { computed } from 'vue'
import { logger } from '@/locale'
import { globalFormImports } from '@/utils/imports'
import { defaultArrayStrategies, defaultComponents } from '../component'
import type { FormComponentName, FormImportItem, FormImportItemConfig } from '../types'

export function useImport(imports: FormImportItem[]) {
  const local = computed(() => localRegister(imports))

  const components = computed(() => {
    return {
      ...defaultComponents,
      ...globalFormImports.components,
      ...local.value.components
    } as Partial<Recordable<any, FormComponentName>>
  })

  const componentConfigs = computed(() => {
    return {
      ...globalFormImports.componentConfigs,
      ...local.value.componentConfigs
    } as Partial<Recordable<FormImportItemConfig, FormComponentName>>
  })

  const arrayStrategies = computed(() => {
    return {
      ...defaultArrayStrategies,
      ...globalFormImports.arrayStrategies,
      ...local.value.arrayStrategies
    }
  })

  return {
    components,
    componentConfigs,
    arrayStrategies
  }
}

function localRegister(imports: FormImportItem[]) {
  const components: Recordable = {}
  const componentConfigs: Recordable = {}
  const arrayStrategies: Recordable = {}

  imports.forEach(item => {
    if (!item.name || !item.component) {
      logger.warn('console.form.componentNotExist', { name: item.name || '' })
      return
    }
    components[item.name] = item.component
    if (item.config) {
      componentConfigs[item.name] = item.config
    }
    if (item.isArrayFn) {
      arrayStrategies[item.name] = item.isArrayFn
    }
  })

  return {
    components,
    componentConfigs,
    arrayStrategies
  }
}
