<template>
  <div class="docs-panel">
    <AbUpload
      v-model="files"
      :upload="mockUpload"
      :examples="examples"
      :templates="templates"
      tips="支持图片预览、模板下载和上传前校验；当前示例使用本地模拟上传。"
      multiple
      :limit="3"
    />
    <div class="docs-demo-state">
      <pre>{{ JSON.stringify(files, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { AbUpload, type UploadFile, type UploadRawFile } from '@/components/Upload'

const files = ref<UploadFile[]>([
  {
    name: '示例图片.png',
    url: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/2d9f1468a4bb4cb087436a0d66f6b4fc.png~tplv-uwbnlip3yd-image.image'
  }
])

const examples = [
  {
    name: '示例图片.png',
    url: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/2d9f1468a4bb4cb087436a0d66f6b4fc.png~tplv-uwbnlip3yd-image.image'
  }
]

const templates = [
  {
    name: '导入模板.xlsx',
    url: 'https://example.com/template.xlsx'
  }
]

async function mockUpload(file: UploadRawFile) {
  Message.success(`模拟上传：${file.name}`)
  return {
    name: file.name,
    url: URL.createObjectURL(file)
  }
}
</script>
