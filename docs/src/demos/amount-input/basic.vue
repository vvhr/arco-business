<template>
  <div class="docs-panel">
    <label>金额（四位小数，编辑时保留字符串）</label>
    <AbAmountInput v-model="amount" @change="lastChange = $event" />
    <p>模型值：{{ JSON.stringify(amount) }}；最近一次 change：{{ JSON.stringify(lastChange) }}</p>
    <Button @click="amount = '80.0000'">程序回填 80.0000</Button>
    <label>零位小数（输入 12.34 只保留 12）</label>
    <AbAmountInput v-model="integerAmount" :precision="0" :show-chinese-uppercase="false" />
    <label>只读 / 禁用</label>
    <AbAmountInput :model-value="amount" readonly />
    <AbAmountInput :model-value="amount" disabled />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@arco-design/web-vue'
import { AbAmountInput, type AmountModelValue } from '@/components/AmountInput'

const amount = ref<AmountModelValue>('1234.5000')
const integerAmount = ref<AmountModelValue>('12')
const lastChange = ref<AmountModelValue>(null)
</script>
