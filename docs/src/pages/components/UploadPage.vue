<template>
  <PageHeader eyebrow="Components" title="AbUpload 上传" description="面向业务文件列表的上传组件，统一文件字段映射、模板下载、示例图和上传生命周期。" :tags="['File list', 'Template', 'Preview']" />
  <SectionBlock id="upload-overview" kicker="Overview" title="文件模型" description="组件绑定业务文件对象，而不是 Arco 内部文件对象。fileKeys 用于适配不同后端字段命名。" />
  <DemoBlock id="upload-basic-demo" title="模拟上传" description="当前示例使用本地模拟上传，适合验证文件列表、示例图、模板和提示信息。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="upload-api" title="Props API" description="上传组件的 API 重点在业务文件模型、数量限制、预览下载和生命周期钩子。" :rows="propsRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/upload/basic.vue'
import source from '@docs/demos/upload/basic.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '业务文件列表，支持 v-model。', type: 'UploadFile[]', defaultValue: '[]' },
  { name: 'fileKeys', description: '文件名称和地址字段映射。', type: 'FileKeys', defaultValue: "{ name: 'name', url: 'url' }" },
  { name: 'upload', description: '上传处理函数，返回业务文件对象。', type: '(file) => Promise<UploadFile | false>', defaultValue: '-' },
  { name: 'limit', description: '最大上传数量。', type: 'number', defaultValue: '-' },
  { name: 'listType', description: '文件列表展示类型。', type: 'picture | text', defaultValue: 'picture' }
]
</script>
