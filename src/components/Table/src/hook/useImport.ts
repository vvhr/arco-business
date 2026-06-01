import { computed } from 'vue'
import type {
  TableFormImportItem as ImportItem,
  TableFormImportItemConfig as ImportItemConfig
} from '@/types/imports'
import type { TableFormComponentName as ComponentName } from '../types'
import { defaultArrayStrategies, defaultComponents } from '../component'
import { globalTableImports } from '@/utils/imports'
import { logger } from '@/locale'

/** 合并默认、全局和局部的编辑组件注册表。 */
export function useImport(imports: ImportItem[]) {
  const components = computed(() => {
    return {
      ...defaultComponents,
      ...globalTableImports.components,
      ...localRegister(imports).components
    } as Partial<Recordable<any, ComponentName>>
  })

  const componentConfigs = computed(() => {
    return {
      ...globalTableImports.componentConfigs,
      ...localRegister(imports).componentConfigs
    } as Partial<Recordable<ImportItemConfig, ComponentName>>
  })

  const arrayStrategies = computed(() => {
    return {
      ...defaultArrayStrategies,
      ...globalTableImports.arrayStrategies,
      ...localRegister(imports).arrayStrategies
    }
  })

  return {
    components,
    componentConfigs,
    arrayStrategies
  }
}

/** 将当前 Table 传入的 imports 转换为组件、配置和数组策略映射。 */
function localRegister(imports: ImportItem[]) {
  const components: Recordable = {}
  const componentConfigs: Recordable = {}
  const arrayStrategies: Recordable = {}

  imports.forEach(item => {
    if (!item.name || !item.component) {
      logger.warn('console.table.componentNotExist', { name: item.name || '' })
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
