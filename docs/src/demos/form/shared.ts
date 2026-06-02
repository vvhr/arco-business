import { defineComponent, h } from 'vue'
import { Tag } from '@arco-design/web-vue'
import { AbTable } from '@/components/Table'
import type {
  FormDisabledStyles,
  FormImportItem,
  FormLabelAlign,
  FormLayout,
  FormSchema,
  FormSchemaProps
} from '@/components/Form'
import type { TableColumn } from '@/components/Table'

export type {
  FormDisabledStyles,
  FormImportItem,
  FormLabelAlign,
  FormLayout,
  FormSchema,
  FormSchemaProps
}

export const layoutOptions = [
  { label: 'horizontal', value: 'horizontal' },
  { label: 'vertical', value: 'vertical' },
  { label: 'inline', value: 'inline' }
]

export const alignOptions = [
  { label: 'right', value: 'right' },
  { label: 'left', value: 'left' }
]

export const departmentOptions = [
  { label: '研发中心', value: 'rd' },
  { label: '交付中心', value: 'delivery' },
  { label: '客户成功', value: 'success' }
]

export const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '项目经理', value: 'pm' },
  { label: '开发工程师', value: 'dev' }
]

export const treeOptions = [
  {
    label: '总部',
    value: 'hq',
    children: [
      {
        label: '华东区',
        value: 'east',
        children: [
          { label: '上海', value: 'shanghai' },
          { label: '杭州', value: 'hangzhou' }
        ]
      },
      {
        label: '华南区',
        value: 'south',
        children: [{ label: '深圳', value: 'shenzhen' }]
      }
    ]
  }
]

export const basicDisabledStyles: FormDisabledStyles = {
  noPadding: true,
  defaultCursor: true,
  noSuffix: true
}

export const editDisabledStyles: FormDisabledStyles = {
  bgColor: false,
  noPadding: true,
  defaultCursor: true,
  noSuffix: true
}

export const basicSchemaProps: FormSchemaProps = {
  layoutProps: { span: 8 },
  componentProps: { allowClear: true }
}

export const basicSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    formItemProps: { rules: [{ required: true, message: '请输入姓名' }] },
    componentProps: { placeholder: '请输入姓名' }
  },
  {
    field: 'department',
    label: '部门',
    component: 'Select',
    componentProps: { options: departmentOptions }
  },
  {
    field: 'roles',
    label: '角色',
    component: 'CheckboxGroup',
    componentProps: { options: roleOptions }
  },
  {
    field: 'city',
    label: '城市',
    component: 'Cascader',
    componentProps: { options: treeOptions }
  },
  {
    field: 'dateRange',
    label: '日期范围',
    component: 'RangePicker'
  },
  {
    field: 'enabled',
    label: '启用',
    component: 'Switch'
  }
]

export const infoSchemas: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    formItemProps: { extra: '这里展示 extra 文本' }
  },
  {
    field: 'slotExtra',
    label: '扩展插槽',
    component: 'Input',
    formItemProps: { extra: 'slotExtra--extra' }
  },
  {
    field: 'slotHelp',
    label: '帮助插槽',
    component: 'Input',
    formItemProps: { help: 'slotHelp--help' }
  }
]

export const containerSchemas: FormSchema[] = [
  {
    type: 'Container',
    key: 'base',
    component: 'Group',
    label: '基础信息',
    children: [
      {
        field: 'projectName',
        label: '项目名称',
        component: 'Input',
        formItemProps: { rules: [{ required: true, message: '请输入项目名称' }] }
      },
      { field: 'department', label: '负责部门', component: 'Select', componentProps: { options: departmentOptions } }
    ],
    layoutProps: { span: 24 }
  },
  {
    type: 'Container',
    key: 'delivery',
    component: 'Group',
    label: '交付信息',
    children: [
      { field: 'city', label: '交付城市', component: 'Cascader', componentProps: { options: treeOptions } },
      { field: 'remark', label: '备注', component: 'Textarea', componentProps: { autoSize: true } }
    ],
    layoutProps: { span: 24 }
  }
]

const tableColumns: TableColumn[] = [
  { field: 'name', label: '事项', width: 160 },
  { field: 'owner', label: '负责人', width: 120 },
  { field: 'status', label: '状态', width: 120 }
]

const tableData = [
  { id: 1, name: '需求确认', owner: '张三', status: 'done' },
  { id: 2, name: '联调排期', owner: '李四', status: 'doing' }
]

export const tableField = defineComponent({
  name: 'DocsFormTableField',
  inheritAttrs: false,
  setup() {
    return () =>
      h(AbTable, {
        modelValue: tableData,
        columns: tableColumns,
        form: {},
        excontext: {},
        dict: {},
        bordered: true
      })
  }
})

export const statusLabel = defineComponent({
  name: 'DocsStatusLabel',
  inheritAttrs: false,
  setup() {
    return () => h(Tag, { color: 'green' }, () => 'TSX/渲染函数组件')
  }
})

export const editImports: FormImportItem[] = [
  { name: 'TableField', component: tableField },
  { name: 'StatusLabel', component: statusLabel }
]

export const editSchemas: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    formItemProps: { rules: [{ required: true, message: '请输入标题' }] }
  },
  { field: 'status', label: '状态提示', component: 'StatusLabel' },
  {
    field: 'items',
    label: '嵌套表格',
    component: 'TableField',
    layoutProps: { span: 24 }
  }
]
