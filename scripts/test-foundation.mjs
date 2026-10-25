import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createSSRApp, h, reactive, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createServer } from 'vite'

const require = createRequire(import.meta.url)
const {
  AbTable,
  AbAmountInput,
  formatAmount,
  sumAmounts,
  formatDecimal,
  normalizeAmountInputValue
} = require('../dist/index.cjs')

assert.equal(
  formatAmount('9007199254740993.1234', { amountThousand: false, amountDigits: 4 }),
  '9007199254740993.1234'
)
assert.equal(formatAmount('-1234.565', { amountDigits: 2 }), '-1,234.57')
assert.equal(formatAmount('1.235e-2', { amountDigits: 4 }), '0.0124')
assert.equal(formatAmount('0', { amountZeroDisplay: '0', amountUnit: '元' }), '0')
assert.equal(formatAmount(null, { defaultValue: '--' }), '--')
assert.equal(formatAmount('1.2000', { amountDigits: 4, amountZero: false }), '1.2')
assert.equal(sumAmounts(['0.1', '0.2', '-0.05', null, 'invalid'], 4), '0.2500')
assert.equal(sumAmounts(['9007199254740993.1234', '0.0001'], 4), '9007199254740993.1235')
assert.equal(sumAmounts(['1e-7', '2e-7']), '0.0000003')
assert.equal(formatDecimal('-9.995', 2), '-10.00')
assert.deepEqual(normalizeAmountInputValue('-1,234.5600', 4, null), {
  display: '-1234.5600',
  normalized: '-1234.5600',
  output: '-1234.5600'
})

const raw = { id: 'one', amount: '9007199254740993.1234' }
let receivedRaw
const html = await renderToString(
  createSSRApp({
    render: () =>
      h(AbTable, {
        modelValue: [raw],
        pagination: false,
        showSummary: true,
        columns: [
          { field: 'id', label: '编号' },
          {
            field: 'amount',
            label: '金额',
            type: 'amount',
            typeProps: { amountDigits: 4, amountThousand: true }
          }
        ],
        summaryMethod: ({ rawData }) => {
          receivedRaw = rawData
          return [
            {
              id: '合计',
              amount: sumAmounts(
                rawData.map(row => row.amount),
                4
              )
            }
          ]
        }
      })
  })
)
assert.equal(receivedRaw[0], raw)
assert.ok(html.includes('9,007,199,254,740,993.1234'))
assert.ok(html.includes('9007199254740993.1234'))

const overridden = await renderToString(
  createSSRApp({
    render: () =>
      h(AbTable, {
        modelValue: [{ value: '1.2345' }],
        pagination: false,
        columns: [{ field: 'value', label: '金额', type: 'amount', formatter: () => '自定义金额' }]
      })
  })
)
assert.ok(overridden.includes('自定义金额'))
const input = await renderToString(
  createSSRApp({
    render: () =>
      h(AbAmountInput, { modelValue: '1234.5000', readonly: true, showChineseUppercase: false })
  })
)
assert.ok(input.includes('1,234.5000'))
console.log('Foundation: exact amounts, raw summary rows, amount formatter and AmountInput passed')

const server = await createServer({ configFile: false, server: { middlewareMode: true } })
try {
  const { usePagination } = await server.ssrLoadModule(
    '/src/components/Table/src/hook/usePagination.ts'
  )
  const events = []
  const state = usePagination(reactive({ page: 1, pageSize: 10 }), (...event) => events.push(event))
  const stop = state.watchPage()
  state.currentPageRef.value = 2
  state.pageSizeRef.value = 50
  assert.deepEqual(events, [
    ['update:page', 2],
    ['update:pageSize', 50]
  ])
  await nextTick()
  assert.equal(events.length, 2)
  stop()
  console.log('Foundation: pagination models update synchronously without duplicate notifications')
} finally {
  await server.close()
}
