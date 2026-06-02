<template>
  <div class="docs-panel">
    <AbUpload
      v-model="files"
      list-type="text"
      downloadable
      multiple
      :limit="5"
      :upload="mockUpload"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :download-file="downloadFile"
      tips="text 列表会根据文件扩展名展示图标，并保留上传、预览、下载、删除控件。"
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
  { name: '需求清单.xlsx', url: 'https://example.com/requirements.xlsx' },
  { name: '接口说明.pdf', url: 'https://example.com/api.pdf' },
  { name: '截图.png', url: 'https://example.com/screenshot.png' }
])

function beforeUpload(file: UploadRawFile) {
  const allow = file.size <= 10 * 1024 * 1024
  if (!allow) Message.warning('单个文件不能超过 10MB')
  return allow
}

async function mockUpload(file: UploadRawFile) {
  Message.success(`模拟上传：${file.name}`)
  return {
    name: file.name,
    url: URL.createObjectURL(file)
  }
}

function beforeRemove(file: UploadFile) {
  Message.info(`模拟删除前检查：${file.name}`)
  return true
}

function downloadFile(file: UploadFile) {
  Message.info(`模拟下载：${file.name}`)
}
</script>
