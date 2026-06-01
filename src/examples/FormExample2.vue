<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>AbForm 表单组件</h2>
      <p>基于 Arco Design Vue 的独立新版表单组件</p>
    </div>

    <Card class="demo-card" title="基础能力：全部输入组件">
      <template #extra>
        <Space wrap>
          <Select v-model="basicLayout" size="small" :style="{ width: '132px' }" :options="layoutOptions" />
          <Select v-model="basicAlign" size="small" :style="{ width: '116px' }" :options="alignOptions" />
          <Switch v-model="basicDisabled" size="small" />
          <Button size="small" type="primary" @click="validateBasic">校验</Button>
          <Button size="small" @click="clearBasic">清空</Button>
        </Space>
      </template>
      <AbForm
        ref="basicFormRef"
        v-model:model="basicModel"
        controlled
        :schemas="basicSchemas"
        :disabled="basicDisabled"
        :disabled-styles="basicDisabledStyles"
        :layout="basicLayout"
        :label-align="basicAlign"
        label-col-flex="112px"
        :schema-props="basicSchemaProps"
        @change="handleChange"
      />
    </Card>

    <Card class="demo-card" title="扩展信息：extra / help">
      <AbForm
        v-model:model="infoModel"
        controlled
        :schemas="infoSchemas"
        layout="horizontal"
        label-align="right"
        label-col-flex="120px"
        :schema-props="{ layoutProps: { span: 12 }, componentProps: { allowClear: true } }"
      >
        <template #slotExtra--extra>
          <Tag color="green">extra 插槽：始终显示在控件下方</Tag>
        </template>
        <template #slotHelp--help>
          <span class="help-slot">help 插槽：会与校验提示共享位置</span>
        </template>
      </AbForm>
    </Card>

    <Card class="demo-card" title="容器与锚点">
      <div ref="anchorScrollRef" class="anchor-frame">
        <AbForm
          v-model:model="containerModel"
          controlled
          anchor
          :scroll-ref="anchorScrollRef"
          :schemas="containerSchemas"
          :imports="containerImports"
          :anchor-props="{ smooth: true, changeHash: false, boundary: 12 }"
          :anchor-affix-style="{ position: 'absolute', left: '12px', top: '12px' }"
          :schema-props="{ layoutProps: { span: 12 }, componentProps: { allowClear: true } }"
        />
      </div>
    </Card>

    <Card class="demo-card" title="编辑能力：禁用态与嵌套表格">
      <template #extra>
        <Space>
          <Switch v-model="editDisabled" size="small" />
          <Button size="small" type="primary" @click="validateEdit">校验</Button>
          <Button size="small" @click="clearEdit">清空</Button>
        </Space>
      </template>
      <AbForm
        ref="editFormRef"
        v-model:model="editModel"
        controlled
        :disabled="editDisabled"
        :disabled-styles="editDisabledStyles"
        :schemas="editSchemas"
        layout="horizontal"
        label-align="right"
        label-col-flex="118px"
        :schema-props="{ layoutProps: { span: 8 }, componentProps: { allowClear: true } }"
      />
    </Card>

    <Card class="demo-card" title="当前表单数据">
      <pre class="state-view">{{
        JSON.stringify({ basicModel, infoModel, containerModel, editModel }, null, 2)
      }}</pre>
    </Card>
  </div>
</template>

<script setup lang="tsx">
import { computed, defineComponent, h, ref } from 'vue'
import {
  Button,
  Card,
  Message,
  Select,
  Space,
  Switch,
  Tag
} from '@arco-design/web-vue'
import {
  AbForm,
  type AbFormImportItem,
  type AbFormInstance,
  type AbFormDisabledStyles,
  type AbFormLayout,
  type AbFormLabelAlign,
  type AbFormSchema,
  type AbFormSchemaProps
} from '@/components/Form2'
import type { TableColumn } from '@/components/Table'

const basicFormRef = ref<AbFormInstance>()
const editFormRef = ref<AbFormInstance>()
const anchorScrollRef = ref<HTMLElement | null>(null)

const basicLayout = ref<AbFormLayout>('horizontal')
const basicAlign = ref<AbFormLabelAlign>('right')
const basicDisabled = ref(true)
const editDisabled = ref(false)
const basicDisabledStyles: AbFormDisabledStyles = {
  noPadding: true,
  defaultCursor: true,
  noSuffix: true
}
const editDisabledStyles: AbFormDisabledStyles = {
  bgColor: false,
  noPadding: true,
  defaultCursor: true,
  noSuffix: true
}

const layoutOptions = [
  { label: 'horizontal', value: 'horizontal' },
  { label: 'vertical', value: 'vertical' },
  { label: 'inline', value: 'inline' }
]

const alignOptions = [
  { label: 'right', value: 'right' },
  { label: 'left', value: 'left' }
]

const departmentOptions = [
  { label: '研发中心', value: 'rd' },
  { label: '交付中心', value: 'delivery' },
  { label: '客户成功', value: 'success' }
]

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '项目经理', value: 'pm' },
  { label: '开发工程师', value: 'dev' }
]

const treeOptions = [
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

const transferOptions = [
  { label: '线索导入', value: 'lead' },
  { label: '合同审批', value: 'contract' },
  { label: '回款提醒', value: 'payment' },
  { label: '售后工单', value: 'ticket' }
]

const tableColumns: TableColumn[] = [
  { field: 'name', label: '事项', width: 160 },
  { field: 'owner', label: '负责人', width: 120 },
  { field: 'status', label: '状态', width: 120 }
]

const basicTableData = [
  { id: 1, name: '需求确认', owner: '张三', status: 'done' },
  { id: 2, name: '联调排期', owner: '李四', status: 'doing' }
]

const uploadFile = {
  name: '迁移说明.txt',
  url: 'https://example.com/ab-form-demo.txt'
}

const basicModel = ref<Recordable>({
  autoComplete: 'AB-2026-001',
  autoCompleteSearch: 'AB-2026-002',
  cascader: ['hq', 'east', 'shanghai'],
  cascaderMultiple: [
    ['hq', 'east', 'shanghai'],
    ['hq', 'south', 'shenzhen']
  ],
  checkboxGroup: ['pm'],
  checkboxGroupVertical: ['admin', 'dev'],
  colorPicker: '#165dff',
  colorPickerDisabledAlpha: '#ff7d00',
  comboInput: 'SKU-2026/研发中心',
  datePicker: '2026-06-02',
  datePickerMonth: '2026-06',
  datePickerYear: '2026',
  rangePicker: ['2026-06-02', '2026-06-09'],
  rangePickerTime: ['2026-06-02 09:00:00', '2026-06-09 18:30:00'],
  input: 'Arco 迁移项目',
  inputPassword: 'secret-2026',
  inputSearch: '迁移检索关键字',
  inputNumber: 12,
  inputNumberButton: 88,
  inputTag: ['Arco', 'Form'],
  inputTagCollapsed: ['表单', '禁用态', 'Arco', '多标签'],
  mention: '@owner 请确认',
  radioGroup: 'project',
  radioGroupNormal: 'dev',
  rate: 4,
  rateHalf: 3.5,
  select: 'rd',
  selectMultiple: ['rd', 'delivery'],
  slider: 62,
  sliderRange: [20, 80],
  switchValue: true,
  table: basicTableData,
  timePicker: '09:30:00',
  timeRange: ['09:00:00', '18:30:00'],
  transfer: ['lead', 'payment'],
  treeSelect: 'shanghai',
  treeSelectMultiple: ['shanghai', 'hangzhou'],
  textarea: '这是一个用于验证 Textarea 的较长备注内容。',
  textareaCount: '开启字数统计与禁用态阅读效果。',
  upload: [uploadFile],
  uploadPicture: [uploadFile],
  verificationCode: '123456'
})

const basicSchemaProps = computed<AbFormSchemaProps>(() => ({
  layoutProps: { span: basicLayout.value === 'inline' ? 24 : 8 },
  componentProps: { allowClear: true },
  formItemProps: {
    validateTrigger: ['change', 'blur']
  }
}))

const basicSchemas: AbFormSchema[] = [
  {
    field: 'autoComplete',
    component: 'AutoComplete',
    label: 'AutoComplete',
    componentProps: { data: ['AB-2026-001', 'AB-2026-002', 'AB-2026-003'] },
    formItemProps: { autoRules: ['isRequired'] }
  },
  {
    field: 'autoCompleteSearch',
    component: 'AutoComplete',
    label: 'AutoComplete 搜索',
    componentProps: {
      data: ['AB-2026-001', 'AB-2026-002', 'AB-2026-003'],
      allowSearch: true
    }
  },
  {
    field: 'cascader',
    component: 'Cascader',
    label: 'Cascader',
    componentProps: { options: treeOptions }
  },
  {
    field: 'cascaderMultiple',
    component: 'Cascader',
    label: 'Cascader 多选',
    componentProps: { options: treeOptions, multiple: true }
  },
  {
    field: 'checkboxGroup',
    component: 'CheckboxGroup',
    label: 'CheckboxGroup',
    componentProps: { options: roleOptions }
  },
  {
    field: 'checkboxGroupVertical',
    component: 'CheckboxGroup',
    label: 'Checkbox 纵向',
    componentProps: { options: roleOptions, direction: 'vertical' }
  },
  {
    field: 'colorPicker',
    component: 'ColorPicker',
    label: 'ColorPicker'
  },
  {
    field: 'colorPickerDisabledAlpha',
    component: 'ColorPicker',
    label: 'ColorPicker 文本',
    componentProps: { showText: true, disabledAlpha: true }
  },
  {
    field: 'comboInput',
    component: 'ComboInput',
    label: 'ComboInput',
    componentProps: {
      template: [
        { tag: 'input', prop: 'sku', componentProps: { placeholder: '编号' } },
        { tag: 'span', content: ' / ' },
        {
          tag: 'select',
          prop: 'area',
          componentProps: { options: departmentOptions, placeholder: '部门' }
        }
      ]
    }
  },
  {
    field: 'datePicker',
    component: 'DatePicker',
    label: 'DatePicker',
    componentProps: { valueFormat: 'YYYY-MM-DD' }
  },
  {
    field: 'datePickerMonth',
    component: 'DatePicker',
    label: 'DatePicker 月',
    componentProps: { mode: 'month', valueFormat: 'YYYY-MM' }
  },
  {
    field: 'datePickerYear',
    component: 'DatePicker',
    label: 'DatePicker 年',
    componentProps: { mode: 'year', valueFormat: 'YYYY' }
  },
  {
    field: 'rangePicker',
    component: 'RangePicker',
    label: 'RangePicker',
    componentProps: { valueFormat: 'YYYY-MM-DD' }
  },
  {
    field: 'rangePickerTime',
    component: 'RangePicker',
    label: 'RangePicker 时间',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    field: 'input',
    component: 'Input',
    label: 'Input'
  },
  {
    field: 'inputPassword',
    component: 'Input',
    label: 'Input 密码',
    componentProps: { type: 'password' }
  },
  {
    field: 'inputSearch',
    component: 'Input',
    label: 'Input 前后缀',
    insideProps: {
      renders: {
        prefix: 'Q',
        suffix: 'Enter'
      }
    }
  },
  {
    field: 'inputNumber',
    component: 'InputNumber',
    label: 'InputNumber',
    componentProps: { min: 0, max: 100 }
  },
  {
    field: 'inputNumberButton',
    component: 'InputNumber',
    label: 'InputNumber 按钮',
    componentProps: { min: 0, max: 100, mode: 'button' }
  },
  {
    field: 'inputTag',
    component: 'InputTag',
    label: 'InputTag'
  },
  {
    field: 'inputTagCollapsed',
    component: 'InputTag',
    label: 'InputTag 折叠',
    componentProps: { maxTagCount: 2 }
  },
  {
    field: 'mention',
    component: 'Mention',
    label: 'Mention',
    componentProps: { options: ['owner', 'pm', 'dev'] }
  },
  {
    field: 'radioGroup',
    component: 'RadioGroup',
    label: 'RadioGroup',
    componentProps: {
      type: 'button',
      options: [
        { label: '项目', value: 'project' },
        { label: '运维', value: 'ops' }
      ]
    }
  },
  {
    field: 'radioGroupNormal',
    component: 'RadioGroup',
    label: 'Radio 普通',
    componentProps: { options: roleOptions }
  },
  {
    field: 'rate',
    component: 'Rate',
    label: 'Rate'
  },
  {
    field: 'rateHalf',
    component: 'Rate',
    label: 'Rate 半星',
    componentProps: { allowHalf: true }
  },
  {
    field: 'select',
    component: 'Select',
    label: 'Select',
    componentProps: { options: departmentOptions }
  },
  {
    field: 'selectMultiple',
    component: 'Select',
    label: 'Select 多选',
    componentProps: { options: departmentOptions, multiple: true }
  },
  {
    field: 'slider',
    component: 'Slider',
    label: 'Slider'
  },
  {
    field: 'sliderRange',
    component: 'Slider',
    label: 'Slider 范围',
    componentProps: { range: true }
  },
  {
    field: 'switchValue',
    component: 'Switch',
    label: 'Switch'
  },
  {
    field: 'table',
    component: 'Table',
    label: 'Table',
    layoutProps: { span: 24 },
    componentProps: {
      columns: tableColumns,
      bordered: { cell: true },
      indexable: { label: '序号', width: 70 },
      pagination: false
    }
  },
  {
    field: 'timePicker',
    component: 'TimePicker',
    label: 'TimePicker'
  },
  {
    field: 'timeRange',
    component: 'TimePicker',
    label: 'TimePicker 范围',
    componentProps: { type: 'time-range' }
  },
  {
    field: 'transfer',
    component: 'Transfer',
    label: 'Transfer',
    layoutProps: { span: 16 },
    componentProps: { options: transferOptions }
  },
  {
    field: 'treeSelect',
    component: 'TreeSelect',
    label: 'TreeSelect',
    componentProps: { options: treeOptions }
  },
  {
    field: 'treeSelectMultiple',
    component: 'TreeSelect',
    label: 'TreeSelect 多选',
    componentProps: { options: treeOptions, multiple: true }
  },
  {
    field: 'textarea',
    component: 'Textarea',
    label: 'Textarea',
    layoutProps: { span: 16 },
    componentProps: { autoSize: { minRows: 2, maxRows: 4 } }
  },
  {
    field: 'textareaCount',
    component: 'Textarea',
    label: 'Textarea 字数',
    layoutProps: { span: 16 },
    componentProps: { maxLength: 120, showWordLimit: true, autoSize: { minRows: 2, maxRows: 4 } }
  },
  {
    field: 'upload',
    component: 'Upload',
    label: 'Upload',
    value: [],
    layoutProps: { span: 16 },
    componentProps: {
      listType: 'text',
      limit: 3,
      tips: 'AbUpload 列表模式',
      upload: async (file: File) => ({ name: file.name, url: URL.createObjectURL(file) })
    }
  },
  {
    field: 'uploadPicture',
    component: 'Upload',
    label: 'Upload 图片',
    value: [],
    layoutProps: { span: 16 },
    componentProps: {
      listType: 'picture',
      limit: 2,
      tips: 'AbUpload 图片模式',
      upload: async (file: File) => ({ name: file.name, url: URL.createObjectURL(file) })
    }
  },
  {
    field: 'verificationCode',
    component: 'VerificationCode',
    label: 'VerificationCode',
    componentProps: { length: 6 }
  }
]

const infoModel = ref<Recordable>({
  staticInfo: '静态说明',
  dynamicInfo: 'dynamic',
  slotExtra: 'slot-extra',
  slotHelp: '',
  validateHelp: ''
})

const infoSchemas: AbFormSchema[] = [
  {
    field: 'staticInfo',
    component: 'Input',
    label: '静态 extra/help',
    formItemProps: {
      extra: '静态 extra：适合放长期展示的补充信息',
      help: '静态 help：未触发校验时显示'
    }
  },
  {
    field: 'dynamicInfo',
    component: 'Select',
    label: '动态 extra',
    componentProps: {
      options: [
        { label: '标准模式', value: 'standard' },
        { label: '高级模式', value: 'dynamic' }
      ]
    },
    formItemProps: {
      extraRender: form => form.dynamicInfo === 'dynamic'
        ? h(Tag, { color: 'arcoblue' }, () => 'extraRender：高级模式已启用')
        : 'extraRender：标准模式',
      helpRender: form => `helpRender：当前值 ${form.dynamicInfo || '-'}`
    }
  },
  {
    field: 'slotExtra',
    component: 'Input',
    label: 'extra 插槽',
    formItemProps: {
      extra: '该文本会被同名 extra 插槽覆盖'
    }
  },
  {
    field: 'slotHelp',
    component: 'Input',
    label: 'help 插槽',
    formItemProps: {
      help: '该文本会被同名 help 插槽覆盖'
    }
  },
  {
    field: 'validateHelp',
    component: 'Input',
    label: '校验覆盖 help',
    formItemProps: {
      autoRules: ['isRequired'],
      help: '点击校验后，必填错误会占用 help 位置'
    }
  }
]

const CardContainer = defineComponent({
  name: 'AbFormDemoCardContainer',
  props: {
    label: String,
    extra: String
  },
  setup(props, { slots }) {
    return () =>
      h(
        Card,
        { class: 'custom-container-card', title: props.label, bordered: true },
        {
          extra: props.extra ? () => props.extra : undefined,
          default: () => slots.default?.()
        }
      )
  }
})

const containerImports: AbFormImportItem[] = [
  {
    name: 'CardContainer',
    component: CardContainer
  }
]

const containerModel = ref<Recordable>({
  projectName: 'AbForm 重构',
  owner: '张三',
  summary: '容器示例',
  budget: 180000,
  deliveryTime: '10:00:00',
  risk: '中',
  comment: ''
})

const containerSchemas: AbFormSchema[] = [
  {
    key: 'baseGroup',
    type: 'Container',
    component: 'Group',
    label: '内置 Group 容器',
    componentProps: { decor: true, bg: true },
    layoutProps: { span: 24 },
    children: [
      { field: 'projectName', component: 'Input', label: '项目名称' },
      { field: 'owner', component: 'Input', label: '负责人' }
    ]
  },
  {
    key: 'blankGroup',
    type: 'Container',
    component: 'Blank',
    label: '内置 Blank 容器',
    layoutProps: { span: 24 },
    children: [
      { field: 'summary', component: 'Textarea', label: '摘要', layoutProps: { span: 24 } }
    ]
  },
  {
    key: 'customCardGroup',
    type: 'Container',
    component: 'CardContainer',
    label: '自定义 Card 容器',
    componentProps: { extra: '通过 imports 注册' },
    layoutProps: { span: 24 },
    children: [
      { field: 'budget', component: 'InputNumber', label: '预算', componentProps: { min: 0 } },
      { field: 'deliveryTime', component: 'TimePicker', label: '交付时间' }
    ]
  },
  {
    key: 'deliveryDisclosure',
    type: 'Container',
    component: 'Disclosure',
    label: '内置 Disclosure 容器',
    componentProps: { expand: true, dividerPosition: 'left', extra: '可折叠' },
    layoutProps: { span: 24 },
    children: [
      {
        field: 'risk',
        component: 'Select',
        label: '风险等级',
        componentProps: {
          options: [
            { label: '低', value: '低' },
            { label: '中', value: '中' },
            { label: '高', value: '高' }
          ]
        }
      },
      {
        field: 'comment',
        component: 'Textarea',
        label: '备注',
        layoutProps: { span: 24 },
        componentProps: { autoSize: { minRows: 3, maxRows: 5 } }
      }
    ]
  }
]

const editModel = ref<Recordable>({
  name: '实施服务包',
  type: 'service',
  owners: ['pm'],
  region: ['hq', 'east', 'shanghai'],
  startDate: '2026-06-02',
  activeRange: ['2026-06-02', '2026-07-02'],
  hour: '09:00:00',
  amount: 25000,
  progress: 45,
  enabled: true,
  theme: '#00b42a',
  tags: ['重点'],
  remark: '编辑态示例',
  items: [
    { id: 1, name: '需求分析', quantity: 2, role: 'pm', date: '2026-06-02', enabled: true },
    { id: 2, name: '上线支持', quantity: 1, role: 'dev', date: '2026-06-10', enabled: false }
  ]
})

const editItemColumns: TableColumn[] = [
  {
    field: 'name',
    label: '事项',
    width: 180,
    editProps: {
      component: 'Input',
      formItemProps: { autoRules: ['isRequired'] }
    }
  },
  {
    field: 'quantity',
    label: '数量',
    width: 130,
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 1 },
      formItemProps: { autoRules: ['isRequired'] }
    }
  },
  {
    field: 'role',
    label: '角色',
    width: 160,
    editProps: {
      component: 'Select',
      componentProps: { options: roleOptions },
      formItemProps: { autoRules: ['isRequired'] }
    }
  },
  {
    field: 'date',
    label: '日期',
    width: 190,
    editProps: {
      component: 'DatePicker',
      componentProps: { valueFormat: 'YYYY-MM-DD' }
    }
  },
  {
    field: 'enabled',
    label: '启用',
    width: 120,
    editProps: {
      component: 'Switch'
    }
  }
]

const editSchemas: AbFormSchema[] = [
  { field: 'name', component: 'Input', label: '名称', formItemProps: { autoRules: ['isRequired'] } },
  {
    field: 'type',
    component: 'RadioGroup',
    label: '类型',
    componentProps: {
      type: 'button',
      options: [
        { label: '服务', value: 'service' },
        { label: '产品', value: 'product' }
      ]
    }
  },
  {
    field: 'owners',
    component: 'CheckboxGroup',
    label: '成员',
    componentProps: { options: roleOptions }
  },
  {
    field: 'region',
    component: 'Cascader',
    label: '区域',
    componentProps: { options: treeOptions }
  },
  { field: 'startDate', component: 'DatePicker', label: '开始日期', componentProps: { valueFormat: 'YYYY-MM-DD' } },
  { field: 'activeRange', component: 'RangePicker', label: '有效期', componentProps: { valueFormat: 'YYYY-MM-DD' } },
  { field: 'hour', component: 'TimePicker', label: '时间' },
  { field: 'amount', component: 'InputNumber', label: '金额', componentProps: { min: 0 } },
  { field: 'progress', component: 'Slider', label: '进度' },
  { field: 'enabled', component: 'Switch', label: '启用' },
  { field: 'theme', component: 'ColorPicker', label: '主题色' },
  { field: 'tags', component: 'InputTag', label: '标签' },
  {
    field: 'remark',
    component: 'Textarea',
    label: '备注',
    layoutProps: { span: 24 },
    componentProps: { autoSize: { minRows: 2, maxRows: 4 } }
  },
  {
    field: 'items',
    component: 'Table',
    label: '明细',
    layoutProps: { span: 24 },
    componentProps: {
      columns: editItemColumns,
      bordered: { cell: true },
      indexable: { label: '序号', width: 70 },
      pagination: false
    },
    formItemProps: {
      extra: '切换禁用态时，表格编辑态会同步关闭'
    }
  }
]

function handleChange(data: { value: any; field: string }) {
  Message.info(`${data.field} 已更新`)
}

async function validateBasic() {
  const valid = await basicFormRef.value?.validate()
  valid ? Message.success('校验通过') : Message.error('请检查输入')
}

function clearBasic() {
  basicFormRef.value?.clearValues()
  Message.info('已清空')
}

async function validateEdit() {
  const valid = await editFormRef.value?.validate()
  valid ? Message.success('校验通过') : Message.error('请检查编辑内容')
}

function clearEdit() {
  editFormRef.value?.clearValues()
  Message.info('已清空')
}
</script>

<style scoped>
.anchor-frame {
  position: relative;
  height: 460px;
  overflow: auto;
  padding-left: 160px;
  padding-right: 8px;
}

.custom-container-card {
  width: 100%;
}

.help-slot {
  color: var(--color-warning-6);
}

.state-view {
  margin: 0;
  max-height: 320px;
  overflow: auto;
  white-space: pre-wrap;
  color: var(--color-text-2);
}
</style>
