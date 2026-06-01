<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>Table 表格组件</h2>
      <p>基于 Arco Design Vue 的独立新版表格组件</p>
    </div>

    <Card class="demo-card" title="序号列">
      <Table
        v-model="pagedRows"
        v-model:page="indexPage"
        v-model:page-size="indexPageSize"
        :columns="simpleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :indexable="{ label: '序号', width: 76, fixed: 'left' }"
        :pagination="{ total: pagedRows.length, pageSizeOptions: [5, 10, 20] }"
        bordered
      />
    </Card>

    <Card class="demo-card" title="多选列">
      <Table
        ref="selectionTableRef"
        v-model="selectionRows"
        :columns="simpleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :selectable="checkboxSelection"
        :indexable="true"
        bordered
        @selection-change="handleSelectionChange"
      />
      <Space class="selection-actions">
        <Button type="primary" @click="setDefaultSelection">模拟默认多选</Button>
        <Button @click="clearSelection">清空外部选择</Button>
      </Space>
      <div class="selection-state">
        <div class="selection-state__title">已勾选数据</div>
        <pre>{{ JSON.stringify(selectedRows, null, 2) }}</pre>
      </div>
    </Card>

    <Card class="demo-card" title="单选列">
      <Table
        ref="radioTableRef"
        v-model="radioRows"
        :columns="simpleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :selectable="{ type: 'radio', label: '', width: 56 }"
        bordered
        @selection-change="handleRadioChange"
      />
      <Space class="selection-actions">
        <Button type="primary" @click="setDefaultRadio">模拟默认单选</Button>
        <Button @click="clearRadio">清空外部选择</Button>
      </Space>
      <div class="selection-state">
        <div class="selection-state__title">当前选中数据</div>
        <pre>{{ JSON.stringify(radioSelectedRows, null, 2) }}</pre>
      </div>
    </Card>

    <Card class="demo-card" title="树形数据">
      <Table
        v-model="treeRows"
        :columns="treeColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        row-key="id"
        bordered
      />
    </Card>

    <Card class="demo-card" title="展开列">
      <Table
        v-model="basicRows"
        :columns="simpleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :expandable="{ label: '', width: 48 }"
        bordered
      >
        <template #expand="{ row }">
          <div class="expand-panel">
            <strong>{{ row.name }}</strong>
            <span>{{ row.email }}</span>
            <span>{{ row.remark }}</span>
          </div>
        </template>
      </Table>
    </Card>

    <Card class="demo-card" title="拖拽行">
      <Table
        v-model="draggableRows"
        :columns="simpleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :draggable="{ type: 'handle', label: '', width: 42 }"
        :indexable="true"
        bordered
        @drag-change="handleDragChange"
      />
      <div>拖拽会改变数据顺序，当前数据顺序为：</div>
      <code>
        {{ JSON.stringify(draggableRows, null, 2) }}
      </code>
    </Card>

    <Card class="demo-card" title="多级表头">
      <Table
        v-model="basicRows"
        :columns="groupColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        bordered
      />
    </Card>

    <Card class="demo-card" title="表头副标题">
      <Table
        v-model="basicRows"
        :columns="subtitleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        bordered
      />
    </Card>

    <Card class="demo-card" title="长表头与长内容 Tooltip">
      <Table
        v-model="tooltipRows"
        :columns="tooltipStressColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        bordered
      />
    </Card>

    <Card class="demo-card" title="内置格式化">
      <Table
        v-model="basicRows"
        :columns="formatColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        bordered
      />
    </Card>

    <Card class="demo-card" title="复制与点击">
      <Table
        v-model="basicRows"
        :columns="interactiveColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        bordered
        @value-click="handleValueClick"
      />
    </Card>

    <Card class="demo-card" title="外部操作栏">
      <template #extra>
        <Space>
          <Button type="primary" @click="appendToolbarRow">新增</Button>
          <Button @click="toggleLoading">刷新</Button>
        </Space>
      </template>
      <Table
        v-model="toolbarRows"
        :columns="simpleColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :loading="loading"
        :indexable="true"
        bordered
      />
    </Card>

    <Card class="demo-card" title="指定高度">
      <div class="fixed-height-frame">
        <Table
          v-model="heightRows"
          :columns="simpleColumns"
          :form="{}"
          :excontext="{}"
          :dict="{}"
          :indexable="true"
          adaptive
          bordered
        />
      </div>
    </Card>

    <Card class="demo-card" title="自适应高度">
      <template #extra>
        <Space>
          <span>自适应</span>
          <Switch v-model="adaptiveEnabled" />
        </Space>
      </template>
      <div class="adaptive-height-frame">
        <Table
          v-model="heightRows"
          :columns="simpleColumns"
          :form="{}"
          :excontext="{}"
          :dict="{}"
          :adaptive="adaptiveEnabled"
          :pagination="{ total: heightRows.length, pageSizeOptions: [10, 20, 50] }"
          :indexable="true"
          bordered
        />
      </div>
    </Card>

    <Card class="demo-card" title="合计行">
      <Table
        v-model="basicRows"
        :columns="summaryColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        show-summary
        bordered
      />
    </Card>

    <Card class="demo-card" title="多选与合计行共存">
      <Table
        v-model="summarySelectionRows"
        :columns="summaryColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :selectable="checkboxSelection"
        show-summary
        bordered
      />
    </Card>

    <Card class="demo-card" title="内置操作列">
      <Table
        v-model="basicRows"
        :columns="actionColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        bordered
        @action="handleAction"
      />
    </Card>

    <Card class="demo-card" title="可编辑表格">
      <template #extra>
        <Button type="primary" @click="validateEditable">校验</Button>
      </template>
      <Table
        ref="editableTableRef"
        v-model="editableRows"
        :columns="editableColumns"
        :form="{}"
        :excontext="{}"
        :dict="{}"
        :editable="true"
        :indexable="{ label: '序号', width: 76 }"
        :bordered="{ cell: true }"
        align="center"
        show-summary
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, Message, Space, Switch } from '@arco-design/web-vue'
import {
  Table,
  type TableColumn,
  type TableColumnSelect,
  type TableInstance
} from '@/components/Table'
import type { DictItem } from '@/types/dict'

const editableTableRef = ref<TableInstance>()
const selectionTableRef = ref<TableInstance>()
const radioTableRef = ref<TableInstance>()
const loading = ref(false)
const adaptiveEnabled = ref(true)
const indexPage = ref(1)
const indexPageSize = ref(5)

const statusOptions: DictItem[] = [
  { label: '正常', value: 'active', type: 'success' },
  { label: '禁用', value: 'disabled', type: 'danger' },
  { label: '待审核', value: 'pending', type: 'warning' }
]

const createRows = () => [
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    amount: 12345.67,
    status: 'active',
    createTime: '2024-01-15 10:30:00',
    remark: '支持展开行、复制、点击和合计。'
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13900139000',
    amount: 98765.43,
    status: 'disabled',
    createTime: '2024-02-20 14:20:00',
    remark: '该行通过 selectable 禁止选择。'
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    phone: '13700137000',
    amount: 54321,
    status: 'pending',
    createTime: '2024-03-10 09:15:00',
    remark: '拖动手柄可以调整行顺序。'
  }
]

const createHeightRows = () =>
  Array.from({ length: 18 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    age: 22 + (index % 12),
    email: `user${index + 1}@example.com`,
    phone: `1380013${String(8000 + index).slice(-4)}`,
    amount: 1000 + index * 125.5,
    status: statusOptions[index % statusOptions.length]?.value,
    createTime: '2024-05-01 12:00:00',
    remark: '用于验证滚动高度。'
  }))

const basicRows = ref(createRows())
const pagedRows = ref(createHeightRows())
const selectionRows = ref(createRows())
const radioRows = ref(createRows())
const selectedRows = ref<Recordable[]>([])
const radioSelectedRows = ref<Recordable[]>([])
const draggableRows = ref(createRows())
const toolbarRows = ref(createRows())
const heightRows = ref(createHeightRows())
const tooltipRows = ref([
  {
    id: 1,
    customerName: '上海某大型装备制造集团有限公司新能源事业部',
    projectName: '跨区域智慧供应链协同平台一期建设项目',
    contractCode: 'HT-2024-SUPPLY-CHAIN-0000001',
    ownerDept: '数字化转型办公室与华东交付中心联合项目组',
    deliveryRisk: '接口联调窗口较短，存在跨系统数据口径不一致风险',
    latestProgress: '已完成主数据同步、订单状态回写和财务对账链路的首轮联调',
    nextStep: '等待客户侧安全网关白名单审批后开展压测与灰度发布',
    remark: '这是一段用于验证内容 tooltip 的长文本，单元格应省略显示，悬停时展示完整内容。'
  },
  {
    id: 2,
    customerName: '北京未来城市运营服务股份有限公司',
    projectName: '城市运营事件中台与移动处置端融合升级项目',
    contractCode: 'HT-2024-CITY-OPS-0000002',
    ownerDept: '公共事业产品线城市治理解决方案部',
    deliveryRisk: '移动端离线缓存策略需要与客户现有权限体系重新确认',
    latestProgress: '完成事件分派、处置反馈、督办提醒和统计看板的原型评审',
    nextStep: '补充离线场景异常恢复流程，并准备第二轮业务评审材料',
    remark: '表头副标题也需要足够长，才能验证 TooltipHeader 的溢出检测和提示容器是否正常。'
  }
])
const summarySelectionRows = ref(createRows())

const treeRows = ref([
  {
    id: 1,
    name: '总部',
    owner: '张三',
    amount: 120000,
    children: [
      { id: 11, name: '华东区', owner: '李四', amount: 56000 },
      { id: 12, name: '华南区', owner: '王五', amount: 64000 }
    ]
  },
  {
    id: 2,
    name: '研发中心',
    owner: '赵六',
    amount: 88000,
    children: [
      { id: 21, name: '平台组', owner: '钱七', amount: 43000 },
      { id: 22, name: '业务组', owner: '孙八', amount: 45000 }
    ]
  }
])

const editableRows = ref([
  { id: 1, name: '产品A', price: 100, quantity: 10, category: 'hardware' },
  { id: 2, name: '产品B', price: 200, quantity: 20, category: 'software' }
])

const simpleColumns: TableColumn[] = [
  { field: 'name', label: '姓名', width: 130 },
  { field: 'age', label: '年龄', width: 100, align: 'center' },
  { field: 'email', label: '邮箱', minWidth: 220, ellipsis: true },
  {
    field: 'status',
    label: '状态',
    width: 120,
    type: 'dict',
    typeProps: { dictOptions: statusOptions, dictViewType: 'tag' }
  }
]

const treeColumns: TableColumn[] = [
  { field: 'name', label: '组织名称', minWidth: 180 },
  { field: 'owner', label: '负责人', width: 120 },
  {
    field: 'amount',
    label: '预算',
    width: 160,
    type: 'amount',
    typeProps: { amountThousand: true, amountUnit: '元' }
  }
]

const groupColumns: TableColumn[] = [
  {
    key: 'base',
    label: '基础信息',
    children: [
      { field: 'name', label: '姓名', width: 130 },
      { field: 'age', label: '年龄', width: 100, align: 'center' }
    ]
  },
  {
    key: 'contact',
    label: '联系信息',
    children: [
      { field: 'email', label: '邮箱', minWidth: 220, ellipsis: true },
      { field: 'phone', label: '手机号', width: 150 }
    ]
  }
]

const subtitleColumns: TableColumn[] = [
  { field: 'name', label: '姓名', subLabel: '业务主键展示名', width: 150 },
  { field: 'email', label: '邮箱', subLabel: '超长时保留 tooltip 容器', minWidth: 240, ellipsis: true },
  { field: 'remark', label: '备注', subLabel: '用于验证表头副标题溢出提示', minWidth: 260, ellipsis: true }
]

const tooltipStressColumns: TableColumn[] = [
  {
    field: 'customerName',
    label: '客户主体名称',
    subLabel: '用于验证较长客户名称表头副标题溢出后的提示展示',
    width: 180,
    ellipsis: true
  },
  {
    field: 'projectName',
    label: '项目全称',
    subLabel: '项目名称通常较长，需要同时验证内容省略和 tooltip',
    width: 210,
    ellipsis: true
  },
  {
    field: 'contractCode',
    label: '合同编号',
    subLabel: '编号列宽较窄时应出现内容提示',
    width: 170,
    ellipsis: true
  },
  {
    field: 'ownerDept',
    label: '责任部门',
    subLabel: '多部门联合负责时标题和内容都可能超长',
    width: 190,
    ellipsis: true
  },
  {
    field: 'deliveryRisk',
    label: '交付风险说明',
    subLabel: '用于验证风险描述类长文本在单元格内的 tooltip',
    width: 220,
    ellipsis: true
  },
  {
    field: 'latestProgress',
    label: '最新进展',
    subLabel: '长内容字段应保持行高稳定并悬停显示完整文本',
    width: 240,
    ellipsis: true
  },
  {
    field: 'nextStep',
    label: '下一步计划',
    subLabel: '测试连续多个长表头时的布局与提示行为',
    width: 230,
    ellipsis: true
  },
  {
    field: 'remark',
    label: '备注说明',
    subLabel: '最后一列也需要验证内容 tooltip 是否被容器裁切',
    width: 260,
    ellipsis: true
  }
]

const formatColumns: TableColumn[] = [
  {
    field: 'status',
    label: '字典标签',
    width: 130,
    type: 'dict',
    typeProps: { dictOptions: statusOptions, dictViewType: 'dot-tag' }
  },
  {
    field: 'createTime',
    label: '日期',
    width: 180,
    type: 'date',
    typeProps: { dateFormat: 'YYYY-MM-DD HH:mm' }
  },
  {
    field: 'amount',
    label: '金额',
    width: 180,
    type: 'amount',
    typeProps: { amountThousand: true, amountDigits: 2, amountUnit: '元' }
  },
  {
    field: 'phone',
    label: '敏感信息',
    width: 160,
    type: 'sensitive',
    typeProps: { sensitiveType: 'phone', sensitiveHover: true }
  }
]

const interactiveColumns: TableColumn[] = [
  { field: 'name', label: '姓名', width: 130, clickable: true },
  { field: 'email', label: '邮箱', minWidth: 240, ellipsis: true, copyable: true },
  { field: 'remark', label: '备注', minWidth: 260, ellipsis: true, tooltip: true }
]

const summaryColumns: TableColumn[] = [
  { field: 'name', label: '姓名', width: 130 },
  { field: 'age', label: '年龄', width: 100 },
  {
    field: 'amount',
    label: '金额',
    width: 180,
    type: 'amount',
    summable: true,
    typeProps: { amountThousand: true, amountDigits: 2, amountUnit: '元' }
  }
]

const actionColumns: TableColumn[] = [
  ...simpleColumns,
  {
    key: 'action',
    label: '操作',
    type: 'action',
    width: 240,
    fixed: 'right',
    typeProps: {
      actions: [
        { label: '查看', name: 'view', icon: 'icon-park-outline:preview-open' },
        { label: '编辑', name: 'edit', type: 'primary', icon: 'icon-park-outline:edit', dropdown: 'always' },
        { label: '删除', name: 'delete', icon: 'icon-park-outline:delete', dropdown: 'always' },
        { label: '归档', name: 'archive', icon: 'icon-park-outline:folder-close', dropdown: 'always' }
      ]
    }
  }
]

const editableColumns: TableColumn[] = [
  {
    field: 'name',
    label: '产品名称',
    editProps: {
      component: 'Input',
      formItemProps: { rules: [{ required: true, message: '请输入产品名称' }] }
    }
  },
  {
    field: 'price',
    label: '单价',
    summable: true,
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 0 },
      formItemProps: { rules: [{ required: true, message: '请输入单价' }] }
    }
  },
  {
    field: 'quantity',
    label: '数量',
    width: 120,
    summable: true,
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 0 },
      formItemProps: { rules: [{ required: true, message: '请输入数量' }] }
    }
  },
  {
    field: 'category',
    label: '分类',
    width: 120,
    editProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '硬件', value: 'hardware' },
          { label: '软件', value: 'software' }
        ]
      }
    }
  },
  {
    field: 'total',
    label: '总价',
    formatter: row => (Number(row.price || 0) * Number(row.quantity || 0)).toFixed(2)
  }
]

const checkboxSelection = computed<TableColumnSelect>(() => ({
  label: '',
  width: 56,
  fixed: true,
  selectable: row => row.status !== 'disabled'
}))

function appendToolbarRow() {
  const next = toolbarRows.value.length + 1
  toolbarRows.value.push({
    id: next,
    name: `用户${next}`,
    age: 20 + next,
    email: `user${next}@example.com`,
    phone: '13600136000',
    amount: 1000 * next,
    status: 'active',
    createTime: '2024-05-01 12:00:00',
    remark: '新增行'
  })
}

function toggleLoading() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    Message.success('刷新成功')
  }, 600)
}

function handleSelectionChange(rows: Recordable[]) {
  selectedRows.value = rows
  Message.info(`已选择 ${rows.length} 行`)
}

function handleRadioChange(rows: Recordable[]) {
  radioSelectedRows.value = rows
  Message.info(rows[0] ? `当前选择 ${rows[0].name}` : '已取消选择')
}

function setDefaultSelection() {
  selectionTableRef.value?.updateSelectionKeys([1, 3])
}

function clearSelection() {
  selectionTableRef.value?.updateSelectionKeys([])
}

function setDefaultRadio() {
  radioTableRef.value?.updateSelectionKeys([3])
}

function clearRadio() {
  radioTableRef.value?.updateSelectionKeys([])
}

function handleDragChange() {
  Message.success('行顺序已更新')
}

function handleValueClick(key: string, row: Recordable) {
  Message.info(`${key}: ${row[key]}`)
}

function handleAction(event: { name: string; row: Recordable }) {
  Message.info(`${event.name}: ${event.row.name}`)
}

async function validateEditable() {
  const valid = await editableTableRef.value?.validate()
  Message[valid ? 'success' : 'error'](valid ? '校验通过' : '请检查表格输入')
}
</script>

<style scoped>
.fixed-height-frame {
  height: 320px;
  min-height: 0;
}

.adaptive-height-frame {
  height: 420px;
  min-height: 0;
}

.expand-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 20px;
  color: var(--color-text-2);
  background: var(--color-fill-1);
}

.selection-state {
  margin-top: 12px;
  border: 1px solid var(--color-border-2);
  background: var(--color-fill-1);
  padding: 10px 12px;
}

.selection-actions {
  margin-top: 12px;
}

.selection-state__title {
  margin-bottom: 8px;
  color: var(--color-text-2);
  font-size: 13px;
  font-weight: 500;
}

.selection-state pre {
  margin: 0;
  max-height: 180px;
  overflow: auto;
  color: var(--color-text-2);
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
}
</style>
