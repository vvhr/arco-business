import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { Window } from 'happy-dom'

// 必须先提供 DOM，再载入 Vue 和发行包；挂载真实 AbTable / Arco FormItem。
const window = new Window({ url: 'http://localhost' })
for (const key of [
  'window',
  'document',
  'navigator',
  'Node',
  'Element',
  'HTMLElement',
  'SVGElement',
  'MutationObserver',
  'ResizeObserver',
  'getComputedStyle',
  'requestAnimationFrame',
  'cancelAnimationFrame'
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value:
      typeof window[key] === 'function' && /^[a-z]/.test(key)
        ? window[key].bind(window)
        : key === 'window'
          ? window
          : window[key]
  })
}

const { createApp, defineComponent, h, reactive, nextTick, markRaw } = await import('vue')
const require = createRequire(import.meta.url)
const { AbTable } = require('../dist/index.cjs')
let mounts = 0
const instances = new Map()
const BindingEditor = markRaw(
  defineComponent({
    props: [
      'selected',
      'label',
      'caption',
      'options',
      'fieldNames',
      'disabled',
      'placeholder',
      'token'
    ],
    emits: ['update:selected', 'update:label', 'update:caption'],
    setup(props, { emit, attrs }) {
      const instanceId = ++mounts
      return () => {
        instances.set(props.token, { props: { ...props }, attrs: { ...attrs }, emit, instanceId })
        return h('input', {
          'data-editor': props.token,
          value: props.label,
          disabled: props.disabled,
          placeholder: props.placeholder,
          onInput: event => emit('update:label', event.target.value)
        })
      }
    }
  })
)

async function mountTable(columns, rows = [{ id: 1, value: 'a', name: 'Alpha' }], extra = {}) {
  const host = document.createElement('div')
  document.body.append(host)
  const state = reactive({ rows, columns, editable: true, ...extra })
  const errors = []
  const app = createApp({
    render: () =>
      h(AbTable, {
        ...state,
        modelValue: state.rows,
        pagination: false,
        imports: [
          { name: 'BindingEditor', component: BindingEditor, config: { modelValueKey: 'selected' } }
        ]
      })
  })
  app.config.errorHandler = error => errors.push(error)
  app.mount(host)
  await nextTick()
  assert.deepEqual(errors, [])
  return {
    state,
    host,
    async tick() {
      await nextTick()
      assert.deepEqual(errors, [])
    },
    close() {
      app.unmount()
      host.remove()
    }
  }
}
function editorColumn(editProps) {
  return { field: 'value', label: '名称', editProps: { component: 'BindingEditor', ...editProps } }
}
function editor(token) {
  assert.ok(instances.has(token), `editor ${token} mounted`)
  return instances.get(token)
}

// 静态配置与动态完整配置均支持主字段及额外字段双向绑定。
for (const dynamic of [false, true]) {
  const config = {
    token: `only-${dynamic}`,
    vBinds: { label: 'name' },
    options: [{ label: 'Alpha', value: 'a' }]
  }
  const table = await mountTable([
    editorColumn(dynamic ? { _v_componentProps: () => config } : { componentProps: config })
  ])
  try {
    const current = editor(config.token)
    assert.equal(current.props.selected, 'a')
    assert.equal(current.props.label, 'Alpha')
    assert.deepEqual(current.props.options, config.options)
    current.emit('update:selected', 'b')
    current.emit('update:label', 'Beta')
    await table.tick()
    assert.equal(table.state.rows[0].value, 'b')
    assert.equal(table.state.rows[0].name, 'Beta')
    table.state.rows[0].name = 'External'
    await table.tick()
    assert.equal(table.host.querySelector('input').value, 'External')
    assert.equal(current.attrs.vBinds, undefined)
  } finally {
    table.close()
  }
}

// 同名覆盖、显式 undefined、嵌套对象整体替换及完整六参数上下文。
const calls = []
const contextCalls = []
const eventCalls = []
const table = await mountTable(
  [
    editorColumn({
      componentProps: {
        token: 'static',
        placeholder: '静态提示',
        disabled: true,
        freshKey: 'static',
        options: () => {
          throw new Error('被覆盖的静态 options 不应执行')
        },
        vBinds: { label: 'obsolete', caption: 'obsoleteCaption' },
        'onUpdate:label': value => eventCalls.push(['prop', value]),
        style: { color: 'red' },
        allowClear: true
      },
      _v_componentProps: (...args) => {
        calls.push(args)
        const [row, index] = args
        return {
          token: `merged-${index}`,
          placeholder: row.clearPlaceholder ? undefined : '动态提示',
          disabled: (...context) => {
            contextCalls.push(context)
            return row.locked
          },
          options: (...context) => {
            contextCalls.push(context)
            return [{ text: row.name, id: row.value }]
          },
          fieldNames: { label: 'text', value: 'id' },
          freshKey: row.revision,
          vBinds: row.removeBindings
            ? undefined
            : { label: row.alternate ? 'details.name' : 'name' },
          disabledPlaceholder: '--'
        }
      },
      componentEvent: { 'onUpdate:label': (...args) => eventCalls.push(['event', ...args]) }
    })
  ],
  [
    { id: 1, value: 'a', name: 'Alpha', details: { name: 'Alternate' }, locked: true, revision: 1 },
    { id: 2, value: 'b', name: 'Beta', details: { name: 'Other' }, locked: false, revision: 1 }
  ],
  { form: { source: 'form' }, excontext: { source: 'context' } }
)
try {
  function assertContext(args) {
    const [row, index, column, form, excontext, editable] = args
    assert.equal(row, table.state.rows[index])
    assert.equal(column, table.state.columns[0])
    assert.equal(form, table.state.form)
    assert.equal(excontext, table.state.excontext)
    assert.equal(editable, true)
  }
  assert.ok(calls.some(args => args[1] === 0) && calls.some(args => args[1] === 1))
  calls.forEach(assertContext)
  contextCalls.forEach(assertContext)
  assert.equal(editor('merged-0').props.placeholder, '--')
  assert.equal(editor('merged-1').props.placeholder, '动态提示')
  assert.deepEqual(editor('merged-0').props.options, [{ text: 'Alpha', id: 'a' }])
  assert.equal(editor('merged-0').props.fieldNames.children, 'children')
  assert.equal(editor('merged-0').attrs.allowClear, true)
  assert.equal(editor('merged-0').props.caption, undefined, 'vBinds 整体替换')
  for (const key of ['vBinds', 'freshKey', 'disabledPlaceholder']) {
    assert.equal(editor('merged-0').attrs[key], undefined)
  }
  table.state.rows[0].locked = false
  await table.tick()
  assert.equal(editor('merged-0').props.disabled, false)
  assert.equal(editor('merged-0').props.placeholder, '动态提示')
  table.state.rows[0].locked = true
  await table.tick()
  assert.equal(editor('merged-0').props.placeholder, '--')
  table.state.rows[0].locked = false
  table.state.rows[0].clearPlaceholder = true
  await table.tick()
  assert.equal(editor('merged-0').props.placeholder, undefined, '显式 undefined 清除静态提示')
  table.state.rows[0].alternate = true
  await table.tick()
  assert.equal(editor('merged-0').props.label, 'Alternate', '动态切换后重新回填标签')
  const instanceId = editor('merged-0').instanceId
  const input = table.host.querySelector('[data-editor="merged-0"]')
  input.value = 'Updated alternate'
  input.dispatchEvent(new window.Event('input', { bubbles: true }))
  await table.tick()
  assert.equal(table.state.rows[0].details.name, 'Updated alternate')
  assert.equal(table.state.rows[0].name, 'Alpha', '不再写入旧映射')
  assert.equal(eventCalls[0][0], 'prop')
  assert.equal(eventCalls[1][0], 'event')
  assert.equal(eventCalls[1][2], table.state.rows[0])
  table.state.rows[0].revision++
  await table.tick()
  assert.notEqual(editor('merged-0').instanceId, instanceId, '动态 freshKey 重建编辑组件')
  table.state.rows[0].removeBindings = true
  await table.tick()
  assert.equal(editor('merged-0').props.label, undefined)
  editor('merged-0').emit('update:label', 'Unbound')
  await table.tick()
  assert.equal(table.state.rows[0].details.name, 'Updated alternate', '清除绑定后不会继续回写')
} finally {
  table.close()
}

// 真实 Arco Input：字段级禁用、默认自动提示和手写提示的往返恢复。
for (const dynamic of [false, true]) {
  for (const placeholder of [undefined, '自定义提示']) {
    const defaults = { disabled: row => row.locked, disabledPlaceholder: '--' }
    if (placeholder !== undefined) defaults.placeholder = placeholder
    const inputTable = await mountTable(
      [
        {
          field: 'value',
          label: '名称',
          editProps: dynamic ? { _v_componentProps: () => defaults } : { componentProps: defaults }
        }
      ],
      [{ id: 1, value: '', locked: true }]
    )
    try {
      const input = () => inputTable.host.querySelector('input')
      assert.equal(input().disabled, true)
      assert.equal(input().placeholder, '--')
      inputTable.state.rows[0].locked = false
      await inputTable.tick()
      assert.equal(input().disabled, false)
      assert.equal(input().placeholder, placeholder ?? '请填写名称')
      input().value = '真实输入'
      input().dispatchEvent(new window.Event('input', { bubbles: true }))
      await inputTable.tick()
      assert.equal(inputTable.state.rows[0].value, '真实输入')
      inputTable.state.rows[0].locked = true
      await inputTable.tick()
      assert.equal(input().placeholder, '--')
    } finally {
      inputTable.close()
    }
  }
}

// 显式模型值保持旧版优先级，同时更新事件仍执行内部回写及业务监听器。
for (const mode of ['static', 'dynamic', 'custom', 'undefined', 'extra-binding']) {
  const events = []
  const custom = mode === 'custom' || mode === 'extra-binding'
  const modelKey = custom ? 'selected' : 'modelValue'
  const explicitValue = mode === 'undefined' ? undefined : `${mode}-display`
  const componentProps = {
    token: 'explicit-model',
    [modelKey]: explicitValue,
    [`onUpdate:${modelKey}`]: value => events.push(['props', value])
  }
  if (mode === 'extra-binding') componentProps.vBinds = { selected: 'name' }
  const modelTable = await mountTable([
    {
      field: 'value',
      label: '名称',
      editProps: {
        component: custom ? 'BindingEditor' : 'Input',
        ...(mode === 'dynamic' ? { _v_componentProps: () => componentProps } : { componentProps }),
        componentEvent: { [`onUpdate:${modelKey}`]: value => events.push(['event', value]) }
      }
    }
  ])
  try {
    if (custom) {
      assert.equal(editor('explicit-model').props.selected, explicitValue)
      editor('explicit-model').emit('update:selected', 'changed')
    } else {
      const input = modelTable.host.querySelector('input')
      assert.equal(input.value, explicitValue ?? '')
      input.value = 'changed'
      input.dispatchEvent(new window.Event('input', { bubbles: true }))
    }
    await modelTable.tick()
    assert.equal(modelTable.state.rows[0][mode === 'extra-binding' ? 'name' : 'value'], 'changed')
    assert.deepEqual(events, [
      ['props', 'changed'],
      ['event', 'changed']
    ])
  } finally {
    modelTable.close()
  }
}

// 禁用占位遵循 FormItem 和绑定后的最终状态，包含反复切换及来源叠加。
for (const source of ['form-item', 'binding', 'combined', 'explicit-false']) {
  const componentProps = { disabledPlaceholder: '--', placeholder: '正常提示' }
  if (source !== 'form-item') componentProps.vBinds = { disabled: 'locked' }
  if (source === 'explicit-false') componentProps.disabled = false
  const disabledTable = await mountTable(
    [
      {
        field: 'value',
        label: '名称',
        editProps: {
          componentProps,
          formItemProps: { disabled: source === 'form-item' || source === 'combined' }
        }
      }
    ],
    [{ id: 1, value: '', locked: true }]
  )
  try {
    const assertDisabled = expected => {
      const input = disabledTable.host.querySelector('input')
      assert.equal(input.disabled, expected, `${source}: disabled`)
      assert.equal(input.placeholder, expected ? '--' : '正常提示', `${source}: placeholder`)
    }
    const editProps = disabledTable.state.columns[0].editProps
    assertDisabled(source !== 'explicit-false')
    disabledTable.state.rows[0].locked = false
    await disabledTable.tick()
    assertDisabled(source === 'form-item' || source === 'combined')
    editProps.formItemProps.disabled = false
    await disabledTable.tick()
    assertDisabled(false)
    if (source === 'form-item') editProps.formItemProps.disabled = true
    else disabledTable.state.rows[0].locked = true
    await disabledTable.tick()
    assertDisabled(source !== 'explicit-false')
    // FormItem 禁用优先于组件显式 false。
    editProps.formItemProps.disabled = true
    await disabledTable.tick()
    assertDisabled(true)
  } finally {
    disabledTable.close()
  }
}

// 真实 Arco Select 消费动态 options 函数和 fieldNames，响应外部回填。
const selectTable = await mountTable([
  {
    field: 'value',
    label: '选项',
    editProps: {
      component: 'Select',
      _v_componentProps: row => ({
        options: () => [{ text: row.name, id: row.value }],
        fieldNames: { label: 'text', value: 'id' }
      })
    }
  }
])
try {
  assert.ok(selectTable.host.textContent.includes('Alpha'))
  selectTable.state.rows[0].name = '回填选项'
  selectTable.state.rows[0].value = 'new-value'
  await selectTable.tick()
  assert.ok(selectTable.host.textContent.includes('回填选项'))
} finally {
  selectTable.close()
}

// 真实范围组件根据动态 type 生成成对提示，并在解禁后恢复。
for (const component of ['TimePicker', 'RangePicker']) {
  const rangeTable = await mountTable(
    [
      {
        field: 'value',
        label: '时间',
        editProps: {
          component,
          _v_componentProps: row => ({
            type: 'time-range',
            disabled: row.locked,
            disabledPlaceholder: '--'
          })
        }
      }
    ],
    [{ id: 1, value: undefined, locked: true }]
  )
  try {
    const placeholders = () =>
      [...rangeTable.host.querySelectorAll('input')].map(input => input.placeholder)
    assert.deepEqual(placeholders(), ['--', '--'])
    rangeTable.state.rows[0].locked = false
    await rangeTable.tick()
    assert.deepEqual(placeholders(), ['请选择时间', '请选择时间'])
    rangeTable.state.rows[0].locked = true
    await rangeTable.tick()
    assert.deepEqual(placeholders(), ['--', '--'])
  } finally {
    rangeTable.close()
  }
}

// 空动态返回沿用静态默认；不配置禁用策略时保持原来的提示。
for (const result of [null, undefined, {}]) {
  const fallback = await mountTable([
    editorColumn({
      componentProps: {
        token: 'fallback',
        disabled: true,
        placeholder: '原提示',
        vBinds: { label: 'name' }
      },
      _v_componentProps: () => result
    })
  ])
  try {
    assert.equal(editor('fallback').props.placeholder, '原提示')
    assert.equal(editor('fallback').props.label, 'Alpha')
  } finally {
    fallback.close()
  }
}

await window.happyDOM.close()
console.log(
  'AbTable edit props: mounted static/dynamic merging, contexts, bindings, events, freshKey and disabled transitions passed'
)
