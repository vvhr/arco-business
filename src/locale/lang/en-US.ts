/**
 * English language pack
 */
import type { LocaleConfig } from '../types'

const enUS: LocaleConfig = {
  name: 'English',

  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    reset: 'Reset',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    prev: 'Previous',
    loading: 'Loading...',
    noData: 'No Data',
    more: 'More'
  },

  table: {
    copy: {
      success: 'Copied successfully',
      failed: 'Copy failed'
    },
    selection: {
      selected: 'Selected',
      items: 'items'
    },
    action: {
      more: 'More'
    },
    empty: '-'
  },

  form: {
    placeholder: {
      input: 'Please enter {label}',
      select: 'Please select {label}',
      date: 'Select date',
      time: 'Select time',
      startDate: 'Start date',
      endDate: 'End date',
      startTime: 'Start time',
      endTime: 'End time'
    },
    validation: {
      required: '{label} is required',
      requiredArray: 'Please select at least one {label}',
      noSpace: '{label} cannot contain spaces',
      normalText: '{label} can only contain Chinese, English, and numbers',
      idCard: 'Please enter a valid ID card number',
      mobilePhone: 'Please enter a valid mobile phone number',
      areaPhone: 'Please enter a valid area phone number',
      telephone: 'Please enter a valid telephone number',
      noChinese: '{label} cannot contain Chinese characters',
      creditCode: 'Please enter a valid unified social credit code',
      onlyNumber: '{label} can only contain numbers',
      onlyLetter: '{label} can only contain letters',
      email: 'Please enter a valid email address',
      fieldError: '{field} is invalid',
      tableError: '{field} is invalid',
      checkTable: 'Please check if the table is filled in as required'
    }
  },

  upload: {
    button: 'Click to upload',
    drag: 'Drop file here',
    dragTip: 'or click to upload',
    preview: 'Preview',
    download: 'Download',
    delete: 'Delete',
    uploading: 'Uploading...',
    uploadSuccess: 'Upload successful',
    uploadFailed: 'Upload failed',
    fileSizeExceeded: 'File size exceeds limit',
    fileTypeError: 'File type does not meet requirements',
    fileCountExceeded: 'File count exceeds limit',
    fileCountLimit: 'Maximum {limit} files can be uploaded',
    fileSizeLimit: 'File size cannot exceed {size}',
    uploadFunctionRequired: 'Upload function is not configured',
    previewNotSupported: 'This file does not support preview',
    downloadNotSupported: 'Download is not supported yet',
    empty: 'No files'
  },

  pagination: {
    total: 'Total {total} items',
    goto: 'Go to',
    page: '',
    itemsPerPage: 'items/page'
  },

  disclosure: {
    toggleText: 'Hide',
    collapsedText: 'Show more'
  },
  
  console: {
    table: {
      rowKeyRequired: '[Table] rowKey is required when selection is enabled',
      columnMissingKey: '[Table] column {label} is missing key, please add key to column',
      unknownColumnType: '[Table] Unknown column type: {type}',
      dictTypePropsRequired:
        '[Table] Column used "dict" type but did not configure "typeProps", unable to parse the dictionary normally. Please check the column',
      sensitiveTypeRequired:
        '[Table] Column used "sensitive" type, but "sensitiveType" or "sensitiveRegex" attributes were not set, please check the column',
      noDesensitizationMethod: '[Table] There is no desensitization method for type {type}',
      actionTypeRequired:
        '[Table] The column uses "action" type, but "actions" property is not configured, please check the column',
      actionEventError: '[Table] Action event error',
      actionNotFound: '[Table] dropdownActions does not contain action: {command}',
      componentExists: '[Table] The component {name} already exists and will be overwritten',
      componentNotExist:
        '[Table] Failed to register component array strategy because the component {name} does not exist',
      configExists:
        '[Table] The component configuration {name} already exists and will be overwritten',
      componentRegistered:
        '[Table] The component {name} imported via the imports property has been successfully registered!',
      editFieldRequired:
        '[Table] The edit component has not set the field property. please check column',
      editComponentError:
        '[Table] Configuration error, please check if "column.editProps.component" is correct, please check column'
    },
    form: {
      componentNotExist:
        '[Form] The configuration of the {type} type component is abnormal, The component {component} does not exist',
      componentError:
        '[Form] The configuration of the {type} type component is abnormal, please check if the component {component} is correct!',
      customComponentError:
        '[Form] Custom component configuration exception, if you expect to use a custom render component, please write the component content using the render property or slot!',
      keyRequired:
        '[Form] The component must set the key property or the field property, unable to render schema',
      nestedStepNotSupported:
        '[Form] Unsupported nested Step type child components, unable to render schema',
      nestedDescriptionsNotSupported:
        '[Form] Nested Descriptions type child components are not supported, unable to render schema',
      nestedContainerNotSupported:
        '[Form] Nested Container type child components are not supported, cannot render schema',
      wrapInDescriptions:
        '[Form] In desc mode, please wrap all components within the Descriptions component, the current component is not wrapped within Descriptions, please check schema',
      expressionCompileError: 'Expression compile failed: {code}',
      expressionExecuteError: 'Expression execute failed: {code}',
      dynamicPropertyError: 'Dynamic property {key} error',
      componentExists: '[Form] The component {name} already exists and will be overwritten',
      configExists:
        '[Form] The component configuration {name} already exists and will be overwritten',
      componentRegistered:
        '[Form] The component {name} imported via the imports property has been successfully registered!'
    },
    upload: {
      compressError: 'Image compression failed'
    },
    utils: {
      slotError: 'slot {slot} is not a function',
      styleWidthError:
        'The width value must be a percentage, have the "px" unit suffix, or be an integer.'
    },
    format: {
      invalidDate: 'Unable to parse input value "{value}" as a valid date',
      dateFormatError: 'Error formatting date. Input value: "{value}", Format: "{format}"'
    }
  }
}

export default enUS
