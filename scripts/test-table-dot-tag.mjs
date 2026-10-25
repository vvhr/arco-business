import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

const require = createRequire(import.meta.url)
const { AbTable } = require('../dist/index.cjs')

const cases = [
  { type: 'primary', tagColor: 'arcoblue', dotColor: 'rgb(var(--arcoblue-6))' },
  { type: 'success', tagColor: 'green', dotColor: 'rgb(var(--green-6))' },
  { type: 'info', tagColor: 'gray', dotColor: 'rgb(var(--gray-6))' },
  { type: 'warning', tagColor: 'orange', dotColor: 'rgb(var(--orange-6))' },
  { type: 'danger', tagColor: 'red', dotColor: 'rgb(var(--red-6))' },
  { tagColor: 'arcoblue', dotColor: 'rgb(var(--arcoblue-6))' },
  { type: '', tagColor: 'arcoblue', dotColor: 'rgb(var(--arcoblue-6))' },
  ...[
    'red',
    'orangered',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'arcoblue',
    'purple',
    'pinkpurple',
    'magenta',
    'gray'
  ].map(color => ({ type: 'danger', color, tagColor: color, dotColor: `rgb(var(--${color}-6))` })),
  ...['#165dff', 'rgb(10, 20, 30)', 'var(--custom-status-color)', 'rebeccapurple'].map(color => ({
    type: 'danger',
    color,
    tagColor: null,
    dotColor: color
  }))
]

const options = cases.map((item, index) => ({ ...item, label: `Status ${index}`, value: index }))
const html = await renderToString(
  createSSRApp({
    render: () =>
      h(AbTable, {
        modelValue: cases.map((_, index) => ({ status: index })),
        columns: [
          {
            field: 'status',
            label: '状态',
            type: 'dict',
            typeProps: { dictViewType: 'dot-tag', dictOptions: options }
          }
        ],
        pagination: false
      })
  })
)

const tags = [...html.matchAll(/<span\b[^>]*class="([^"]*\bab-table-dot-tag\b[^"]*)"[^>]*>/g)]
assert.equal(tags.length, cases.length, 'every status should render a dot-tag')
for (const [index, item] of cases.entries()) {
  const [tag, classes] = tags[index]
  assert.ok(tag.includes(`--ab-dot-color:${item.dotColor};`), `case ${index}: ${tag}`)
  assert.ok(
    classes.includes(item.tagColor ? `arco-tag-${item.tagColor}` : 'arco-tag-custom-color'),
    `case ${index}: tag background color should be preserved`
  )
}

assert.equal(
  (html.match(/class="ab-table-dot-tag__dot"/g) ?? []).length,
  cases.length,
  'every status should retain its dot element'
)
console.log(`AbTable dot-tag: ${cases.length} semantic, preset and custom color cases passed`)
