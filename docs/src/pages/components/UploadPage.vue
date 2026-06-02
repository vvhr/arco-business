<template>
  <PageHeader eyebrow="Components" title="AbUpload 上传" description="面向业务文件列表的上传组件，统一文件字段映射、模板下载、示例图和上传生命周期。" :tags="['File list', 'Template', 'Preview']" />
  <SectionBlock id="upload-overview" kicker="Overview" title="文件模型" description="组件绑定业务文件对象，而不是 Arco 内部文件对象。fileKeys 用于适配不同后端字段命名。" />
  <SectionBlock id="upload-arco-diff" kicker="Compare" title="与 Arco Upload 的核心差异" description="AbUpload 是自行实现的业务上传组件，不基于 Arco Upload。它把文件选择、上传、预览、下载、删除、模板下载和生命周期钩子全部交给 props 控制，组件自身负责稳定的 UI、文件图标、图片预览和自适应布局。" />
  <DemoBlock id="upload-basic-demo" title="模拟上传" description="当前示例使用本地模拟上传，适合验证文件列表、示例图、模板和提示信息。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <DemoBlock id="upload-text-demo" title="文本列表与文件图标" description="listType=text 适合附件清单、导入结果和合同文件列表；组件会根据文件类型展示图标并提供操作控件。" :source="textSource">
    <TextListDemo />
  </DemoBlock>
  <ApiTable id="upload-api" title="Props API" description="上传组件的 API 重点在业务文件模型、数量限制、预览下载和生命周期钩子。" :rows="propsRows" />
  <ApiTable id="upload-events" title="Events API" description="上传事件围绕业务文件列表同步、上传成功、删除和预览组织。" :rows="eventsRows" />
  <ApiTable id="upload-types" title="Types API" description="上传组件绑定的是业务文件对象，字段结构由 fileKeys 适配。" :rows="typesRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/upload/basic.vue'
import source from '@docs/demos/upload/basic.vue?raw'
import TextListDemo from '@docs/demos/upload/text-list.vue'
import textSource from '@docs/demos/upload/text-list.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '业务文件列表，支持 v-model。', type: 'UploadFile[]', defaultValue: '[]' },
  { name: 'fileKeys', description: '文件名称和地址字段映射。', type: 'FileKeys', defaultValue: "{ name: 'name', url: 'url' }" },
  { name: 'upload', description: '上传处理函数，返回业务文件对象。', type: '(file) => Promise<UploadFile | false>', defaultValue: '-' },
  { name: 'multiple', description: '是否允许多文件选择，透传给原生 input。', type: 'boolean', defaultValue: 'false' },
  { name: 'accept', description: '可选择的文件类型，透传给原生 input。', type: 'string', defaultValue: '-' },
  { name: 'limit', description: '最大上传数量。', type: 'number', defaultValue: '-' },
  { name: 'size', description: '组件尺寸。', type: 'small | default | large', defaultValue: 'default' },
  { name: 'sizeLimit', description: '文件大小限制，数字默认按 MB 解析。', type: 'string | number', defaultValue: '-' },
  { name: 'disabled', description: '是否禁用上传。', type: 'boolean', defaultValue: 'false' },
  { name: 'listType', description: '文件列表展示类型。', type: 'picture | text', defaultValue: 'picture' },
  { name: 'objectFit', description: '图片填充方式。', type: 'fill | contain | cover | none | scale-down', defaultValue: 'cover' },
  { name: 'examples', description: '示例图列表。', type: 'FileTemplate[]', defaultValue: '-' },
  { name: 'templates', description: '模板文件列表。', type: 'FileTemplate[]', defaultValue: '-' },
  { name: 'tips', description: '上传提示文案。', type: 'string', defaultValue: '-' },
  { name: 'autoCompress', description: '是否自动压缩图片。', type: 'boolean', defaultValue: 'false' },
  { name: 'previewable', description: '是否允许预览。', type: 'boolean', defaultValue: 'true' },
  { name: 'downloadable', description: '是否允许下载已上传文件。', type: 'boolean', defaultValue: 'false' },
  { name: 'preview', description: '自定义预览处理函数。', type: '(file: UploadFile) => void', defaultValue: '-' },
  { name: 'downloadFile', description: '自定义下载处理函数。', type: '(file: UploadFile) => void', defaultValue: '-' },
  { name: 'beforeUpload', description: '上传前校验，返回 false 时阻止上传。', type: '(file: UploadRawFile) => boolean | Promise<boolean>', defaultValue: '-' },
  { name: 'beforeRemove', description: '删除前校验，返回 false 时阻止删除。', type: '(file: UploadFile) => boolean | Promise<boolean>', defaultValue: '-' },
  { name: 'downloadTemplate', description: '模板下载处理函数。', type: '(template: FileTemplate) => void', defaultValue: '-' }
]

const eventsRows: ApiRow[] = [
  { name: 'update:modelValue', description: '业务文件列表变化时触发。', type: '(fileList: UploadFile[]) => void', defaultValue: '-' },
  { name: 'change', description: '上传成功或删除后触发。', type: '(fileList: UploadFile[]) => void', defaultValue: '-' },
  { name: 'upload', description: '单个文件上传成功后触发。', type: '(file: UploadFile) => void', defaultValue: '-' },
  { name: 'remove', description: '文件删除后触发。', type: '(file: UploadFile) => void', defaultValue: '-' },
  { name: 'preview', description: '非图片默认预览时触发。', type: '(file: UploadFile) => void', defaultValue: '-' }
]

const typesRows: ApiRow[] = [
  { name: 'UploadFile', description: '业务文件对象，字段由业务系统决定。', type: 'Record<string, any>', defaultValue: '-' },
  { name: 'UploadRawFile', description: '原始 File 对象扩展，组件会写入 uid。', type: 'File & { uid?: string }', defaultValue: '-' },
  { name: 'FileKeys', description: '业务文件对象的名称和地址字段映射。', type: '{ name: string; url: string }', defaultValue: '-' },
  { name: 'FileTemplate', description: '示例图或模板文件对象。', type: '{ name: string; url: string; [key: string]: any }', defaultValue: '-' },
  { name: 'UploadEmits', description: '上传事件签名集合。', type: 'update:modelValue | change | upload | remove | preview', defaultValue: '-' }
]
</script>
