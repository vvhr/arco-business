<template>
  <div class="docs-panel">
    <Space wrap>
      <Button type="primary" @click="validateRows">校验编辑行</Button>
      <Button @click="togglePermission">{{ pageContext.canEdit ? '关闭编辑' : '开启编辑' }}</Button>
      <Button @click="toggleSubmitting">模拟提交中</Button>
    </Space>
    <AbTable
      ref="tableRef"
      v-model="rows"
      :columns="columns"
      :form="queryForm"
      :excontext="pageContext"
      :dict="{}"
      :editable="pageContext.canEdit"
      :indexable="{ label: '序号', width: 76 }"
      :bordered="{ cell: true }"
      row-key="id"
      @action="handleAction"
      @value-click="handleValueClick"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Button, Message, Space } from '@arco-design/web-vue'
import { AbTable, type TableColumn, type TableInstance } from '@/components/Table'

const tableRef = ref<TableInstance>()
const queryForm = reactive({ projectType: 'internal' })
const pageContext = reactive({
  canEdit: true,
  submittingId: 0,
  ownersByCategory: {
    feature: [
      { label: '产品负责人', value: 'product' },
      { label: '研发负责人', value: 'engineer' }
    ],
    support: [
      { label: '客户成功', value: 'success' },
      { label: '服务台', value: 'service' }
    ]
  }
})

const rows = ref<Recordable[]>([
  { id: 1, task: '配置化表单', category: 'feature', owner: 'product', estimate: 5, locked: false },
  { id: 2, task: '客户字段扩展', category: 'support', owner: 'success', estimate: 2, locked: false },
  { id: 3, task: '线上问题复盘', category: 'support', owner: 'service', estimate: 1, locked: true }
])

const columns: TableColumn[] = [
  {
    field: 'task',
    label: '任务',
    minWidth: 180,
    clickable: row => !row.locked,
    editProps: {
      component: 'Input',
      formItemProps: { autoRules: ['isRequired', 'noSpace'] },
      insideProps: { renders: { suffix: row => (row.locked ? '已锁定' : false) } }
    }
  },
  {
    field: 'category',
    label: '分类',
    width: 140,
    editProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '功能建设', value: 'feature' },
          { label: '客户支持', value: 'support' }
        ]
      },
      componentEvent: {
        onChange: (_value, row, _index, _column, _form, excontext) => {
          row.owner = excontext.ownersByCategory[row.category]?.[0]?.value
        }
      },
      formItemProps: { autoRules: ['isRequired'] }
    }
  },
  {
    field: 'owner',
    label: '负责人',
    width: 150,
    editProps: {
      component: 'Select',
      componentProps: {
        options: (row, _index, _column, _form, excontext) =>
          excontext.ownersByCategory[row.category] || [],
        disabled: row => row.locked
      },
      formItemProps: { autoRules: ['isRequired'] }
    }
  },
  {
    field: 'estimate',
    label: '人天',
    width: 120,
    summable: true,
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 1, max: 20 },
      formItemProps: { autoRules: ['isRequired'] }
    }
  },
  {
    key: 'action',
    label: '操作',
    type: 'action',
    width: 220,
    fixed: 'right',
    hidden: (_row, _index, _column, _form, excontext) => !excontext.canEdit,
    typeProps: {
      actions: (row, _index, _column, _form, excontext) => [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          icon: 'icon-park-outline:save',
          loading: current => excontext.submittingId === current.id,
          disabled: () => row.locked
        },
        {
          label: row.locked ? '解锁' : '锁定',
          name: row.locked ? 'unlock' : 'lock',
          icon: row.locked ? 'icon-park-outline:unlock' : 'icon-park-outline:lock'
        }
      ]
    }
  }
]

async function validateRows() {
  const valid = await tableRef.value?.validate()
  Message[valid ? 'success' : 'error'](valid ? '编辑行校验通过' : '请检查表格输入')
}

function togglePermission() {
  pageContext.canEdit = !pageContext.canEdit
}

function toggleSubmitting() {
  pageContext.submittingId = pageContext.submittingId ? 0 : 1
}

function handleAction(event: { name: string; row: Recordable }) {
  if (event.name === 'lock' || event.name === 'unlock') {
    event.row.locked = event.name === 'lock'
  }
  Message.info(`${event.name}: ${event.row.task}`)
}

function handleValueClick(key: string, row: Recordable) {
  Message.info(`点击 ${key}: ${row.task}`)
}
</script>
