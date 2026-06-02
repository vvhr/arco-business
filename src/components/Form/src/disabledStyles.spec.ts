import { abFormProps } from './props'
import type { FormDisabledStyles } from './types'

const styles: FormDisabledStyles = {
  itemMarginBottom: '12px',
  labelFontSize: '13px'
}

const defaultStyles = abFormProps.disabledStyles.default()
const defaultItemMarginBottom: string = defaultStyles.itemMarginBottom
const defaultLabelFontSize: false | string = defaultStyles.labelFontSize

if (styles.itemMarginBottom !== '12px') {
  throw new Error('FormDisabledStyles should accept itemMarginBottom')
}

if (styles.labelFontSize !== '13px') {
  throw new Error('FormDisabledStyles should accept labelFontSize')
}

if (defaultItemMarginBottom !== '0px') {
  throw new Error('disabledStyles.itemMarginBottom should default to 0px')
}

if (defaultLabelFontSize !== false) {
  throw new Error('disabledStyles.labelFontSize should default to false')
}
