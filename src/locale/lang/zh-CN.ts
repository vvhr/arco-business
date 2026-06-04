/**
 * 简体中文语言包
 */
import type { LocaleConfig } from '../types'

const zhCN: LocaleConfig = {
  name: '简体中文',

  common: {
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    close: '关闭',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    loading: '加载中...',
    noData: '暂无数据',
    more: '更多'
  },

  table: {
    copy: {
      success: '复制成功',
      failed: '复制失败'
    },
    index: '序号',
    summary: {
      total: '合计'
    },
    selection: {
      selected: '当前已选择',
      items: '条数据',
      clear: '清空选择'
    },
    action: {
      more: '更多'
    },
    empty: '-',
    sensitive: {
      original: '原始值: {value}',
      encrypted: '已加密值: {value}'
    },
    editComponentNotFound: '编辑组件未注册: {component}'
  },

  text: {
    expand: '展开',
    collapse: '收起',
    copySuccess: '复制成功',
    copyFailed: '复制失败'
  },

  form: {
    placeholder: {
      input: '请填写{label}',
      select: '请选择{label}',
      date: '选择日期',
      time: '选择时间',
      startDate: '开始日期',
      endDate: '结束日期',
      startTime: '开始时间',
      endTime: '结束时间'
    },
    validation: {
      required: '{label}不能为空',
      requiredArray: '请至少选择一个{label}',
      noSpace: '{label}不得包含空格',
      normalText: '{label}只能包含中文、英文、数字',
      idCard: '请输入正确的身份证号码',
      mobilePhone: '请输入正确的手机号码',
      areaPhone: '请输入正确的带区号的手机号码',
      telephone: '请输入正确的电话号码',
      noChinese: '{label}不能包含中文',
      creditCode: '请输入正确的统一社会信用代码',
      onlyNumber: '{label}只能输入数字',
      onlyLetter: '{label}只能输入字母',
      email: '请输入正确的邮箱地址',
      fieldError: '{field} 填写有误',
      tableError: '{field} 填写有误',
      checkTable: '请检查表格是否按要求填写'
    }
  },

  upload: {
    button: '点击上传',
    viewExamples: '查看示例',
    downloadTemplate: '下载模板',
    drag: '将文件拖到此处',
    dragTip: '或点击上传',
    preview: '预览',
    download: '下载',
    delete: '删除',
    uploading: '上传中...',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    fileSizeExceeded: '文件大小超出限制',
    fileTypeError: '文件类型不符合要求',
    fileCountExceeded: '文件数量超出限制',
    fileCountLimit: '最多只能上传 {limit} 个文件',
    fileSizeLimit: '文件大小不能超过 {size}',
    uploadFunctionRequired: '未配置上传函数',
    previewNotSupported: '该文件不支持预览',
    downloadNotSupported: '暂不支持下载',
    empty: '暂无文件',
    canvasContextUnavailable: '无法获取 canvas context',
    imageLoadFailed: '图片加载失败',
    fileReadFailed: '文件读取失败'
  },

  pagination: {
    total: '共 {total} 条',
    goto: '前往',
    page: '页',
    itemsPerPage: '条/页'
  },

  disclosure: {
    toggleText: '隐藏',
    collapsedText: '显示更多'
  },
  
  console: {
    table: {
      rowKeyRequired: '[Table] 启用选择功能时需要设置 rowKey 属性',
      columnMissingKey: '[Table] 列 {label} 缺少 key 属性，请添加 key',
      unknownColumnType: '[Table] 未知的列类型: {type}',
      dictTypePropsRequired:
        '[Table] 列使用了 dict 类型但未配置 typeProps，无法正常解析字典。请检查列配置',
      sensitiveTypeRequired:
        '[Table] 列使用了 sensitive 类型，但未设置 sensitiveType 或 sensitiveRegex 属性，请检查列配置',
      noDesensitizationMethod: '[Table] 不存在 {type} 类型的脱敏方法',
      actionTypeRequired: '[Table] 列使用了 action 类型，但未配置 actions 属性，请检查列配置',
      actionEventError: '[Table] 操作按钮事件执行错误',
      actionNotFound: '[Table] dropdownActions 中不存在操作: {command}',
      componentExists: '[Table] 组件 {name} 已存在，将被覆盖',
      componentNotExist: '[Table] 注册组件数组策略失败，因为组件 {name} 不存在',
      configExists: '[Table] 组件配置 {name} 已存在，将被覆盖',
      componentRegistered: '[Table] 通过 imports 属性导入的组件 {name} 已成功注册！',
      editFieldRequired: '[Table] 编辑组件未设置 field 属性，请检查列配置',
      editComponentError:
        '[Table] 配置错误，请检查 column.editProps.component 是否正确，请检查列配置'
    },
    form: {
      componentNotExist: '[Form] {type} 类型组件配置异常，组件 {component} 不存在',
      componentError: '[Form] {type} 类型组件配置异常，请检查组件 {component} 是否正确！',
      customComponentError:
        '[Form] 自定义组件配置异常，如果您预期使用自定义渲染组件，请使用 render 属性或 slot 编写组件内容',
      keyRequired: '[Form] 组件必须设置 key 属性或 field 属性，无法渲染 schema',
      nestedStepNotSupported: '[Form] 不支持嵌套 Step 类型子组件，无法渲染 schema',
      nestedDescriptionsNotSupported:
        '[Form] 不支持嵌套 Descriptions 类型子组件，无法渲染 schema',
      nestedContainerNotSupported: '[Form] 不支持嵌套 Container 类型子组件，无法渲染 schema',
      wrapInDescriptions:
        '[Form] 在 desc 模式下，请将所有组件包裹在 Descriptions 组件内，当前组件未包裹在 Descriptions 内，请检查 schema',
      expressionCompileError: '表达式编译失败: {code}',
      expressionExecuteError: '表达式执行失败: {code}',
      dynamicPropertyError: '动态属性 {key} 设置错误',
      componentExists: '[Form] 组件 {name} 已存在，将被覆盖',
      configExists: '[Form] 组件配置 {name} 已存在，将被覆盖',
      componentRegistered: '[Form] 通过 imports 属性导入的组件 {name} 已成功注册！'
    },
    upload: {
      compressError: '图片压缩失败'
    },
    utils: {
      slotError: '{slot} 不是一个方法函数',
      styleWidthError: 'width 值必须为 百分比 或 以"px"单位为后缀 或 是一个整数'
    },
    format: {
      invalidDate: '无法将输入值 "{value}" 解析为有效日期',
      dateFormatError: '格式化日期时发生错误。输入值: "{value}", 格式: "{format}"'
    }
  }
}

export default zhCN
