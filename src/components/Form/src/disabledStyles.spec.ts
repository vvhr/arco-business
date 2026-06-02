import { abFormProps } from './props'
import type { FormDisabledStyles } from './types'

const styles: FormDisabledStyles = {
  itemMarginBottom: '12px'
}

const defaultStyles = abFormProps.disabledStyles.default()
const defaultItemMarginBottom: string = defaultStyles.itemMarginBottom

if (styles.itemMarginBottom !== '12px') {
  throw new Error('FormDisabledStyles should accept itemMarginBottom')
}

if (defaultItemMarginBottom !== '0px') {
  throw new Error('disabledStyles.itemMarginBottom should default to 0px')
}
