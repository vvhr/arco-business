import type {
  TableAction,
  TableColumn,
  TableColumnSelect,
  TableInstance
} from '@/components/Table'
import type { DictItem } from '@/types/dict'

export type { TableColumn, TableColumnSelect, TableInstance }

export const statusOptions: DictItem[] = [
  { label: '正常', value: 'active', type: 'success' },
  { label: '禁用', value: 'disabled', type: 'danger' },
  { label: '待审核', value: 'pending', type: 'warning' }
]

export function createRows() {
  return [
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
}

export function createHeightRows() {
  return Array.from({ length: 18 }, (_, index) => ({
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
}

export const simpleColumns: TableColumn[] = [
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

export const checkboxSelection: TableColumnSelect = {
  label: '',
  width: 56,
  fixed: true,
  selectable: row => row.status !== 'disabled'
}

export const summaryColumns: TableColumn[] = [
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

export const actionItems: TableAction[] = [
  { label: '查看', name: 'view', icon: 'icon-park-outline:preview-open' },
  { label: '编辑', name: 'edit', type: 'primary', icon: 'icon-park-outline:edit', dropdown: 'always' },
  { label: '删除', name: 'delete', icon: 'icon-park-outline:delete', dropdown: 'always' },
  { label: '归档', name: 'archive', icon: 'icon-park-outline:folder-close', dropdown: 'always' }
]
