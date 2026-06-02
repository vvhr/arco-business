<template>
  <div class="docs-panel">
    <Space>
      <Button type="primary" @click="validate">触发校验</Button>
      <Button @click="model.slotHelp = '已补充 help 字段'">填充 help 字段</Button>
    </Space>
    <AbForm
      ref="formRef"
      v-model:model="model"
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
        <span class="help-slot">help 插槽：未触发校验时展示；校验失败后由错误信息覆盖</span>
      </template>
    </AbForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Message, Space, Tag } from '@arco-design/web-vue'
import { AbForm, type FormInstance, type FormSchema } from '@/components/Form'

const formRef = ref<FormInstance>()
const model = ref<Recordable>({
  title: '客户成功周报',
  slotExtra: '展示 extra 插槽',
  slotHelp: ''
})

const infoSchemas: FormSchema[] = [
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
    formItemProps: {
      help: 'slotHelp--help',
      rules: [{ required: true, message: '校验错误会覆盖 help 区域' }]
    }
  }
]

async function validate() {
  const valid = await formRef.value?.validate()
  Message[valid ? 'success' : 'error'](valid ? '校验通过' : 'help 区域已被校验错误覆盖')
}
</script>

<style scoped>
.help-slot {
  color: rgb(var(--warning-6));
}
</style>
