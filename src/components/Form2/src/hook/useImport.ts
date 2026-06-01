import { computed } from 'vue'
import { logger } from '@/locale'
import { globalAbFormImports } from '@/utils/imports'
import { defaultArrayStrategies, defaultComponents } from '../component'
import type { AbFormComponentName, AbFormImportItem, AbFormImportItemConfig } from '../types'

export function useImport(imports: AbFormImportItem[]) {
  const local = computed(() => localRegister(imports))

  const components = computed(() => {
    return {
      ...defaultComponents,
      ...globalAbFormImports.components,
      ...local.value.components
    } as Partial<Recordable<any, AbFormComponentName>>
  })

  const componentConfigs = computed(() => {
    return {
      ...globalAbFormImports.componentConfigs,
      ...local.value.componentConfigs
    } as Partial<Recordable<AbFormImportItemConfig, AbFormComponentName>>
  })

  const arrayStrategies = computed(() => {
    return {
      ...defaultArrayStrategies,
      ...globalAbFormImports.arrayStrategies,
      ...local.value.arrayStrategies
    }
  })

  return {
    components,
    componentConfigs,
    arrayStrategies
  }
}

function localRegister(imports: AbFormImportItem[]) {
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
