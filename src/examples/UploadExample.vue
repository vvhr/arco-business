<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>上传组件</h2>
      <p>支持两种布局模式，配置示例，下载模板，自动压缩，自定义上传请求等功能</p>
    </div>

    <Card class="demo-card">
      <template #title>照片墙模式</template>
      <template #extra>
        <div class="card-actions">
          <RadioGroup v-model="disabled" type="button">
            <Radio :value="false">编辑模式</Radio>
            <Radio :value="true">详情模式</Radio>
          </RadioGroup>
          <RadioGroup v-model="size" type="button">
            <Radio value="small">小</Radio>
            <Radio value="default">中</Radio>
            <Radio value="large">大</Radio>
          </RadioGroup>
          <Button @click="handleUpdate">模拟动态赋值</Button>
        </div>
      </template>
      <AbUpload
        v-model="basicFiles"
        :upload="handleUpload"
        :disabled="disabled"
        :previewable="true"
        :downloadable="true"
        :size="size"
        accept="*.*"
        tips="这里可以自定义提示文本，也可以使用 #tips 插槽自定义渲染"
        :examples="exampleImages"
        :templates="fileTemplates"
      />
    </Card>

    <Card class="demo-card">
      <template #title>列表模式</template>
      <template #extra>
        <div class="card-actions">
          <RadioGroup v-model="disabled" type="button">
            <Radio :value="false">编辑模式</Radio>
            <Radio :value="true">详情模式</Radio>
          </RadioGroup>
          <RadioGroup v-model="size" type="button">
            <Radio value="small">小</Radio>
            <Radio value="default">中</Radio>
            <Radio value="large">大</Radio>
          </RadioGroup>
          <Button @click="handleUpdate">模拟动态赋值</Button>
        </div>
      </template>
      <AbUpload
        v-model="basicFiles"
        :upload="handleUpload"
        :disabled="disabled"
        :previewable="true"
        :downloadable="true"
        :size="size"
        list-type="text"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        tips="支持 PDF、Word、Excel 文件"
        :examples="exampleImages"
        :templates="fileTemplates"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, Message, Radio, RadioGroup } from '@arco-design/web-vue'
import { AbUpload } from '@/index'
import type { UploadFile, UploadRawFile } from '@/components/Upload'

const disabled = ref(false)
const size = ref<any>('default')

const basicFiles = ref<UploadFile[]>([
  {
    name: '示例图片1.png',
    url: 'https://dummyimage.com/600x400/cccccc/000000.png&text=AEUI'
  },
  {
    name: '示例图片2.png',
    url: 'https://dummyimage.com/600x400/cccccc/000000.png&text=AEUI'
  },
  {
    name: '示例不存在的图片1.png',
    url: 'https://example.com/template.png'
  },
  {
    name: '示例不存在的图片2.jpg',
    url: 'https://example.com/template.jpg'
  },
  {
    name: '较长的两行显示的文件名.pdf',
    url: 'https://example.com/template.pdf'
  },
  {
    name: '超长超长超长超长超长超长超长超长超长超长的文件名.pdf',
    url: 'https://example.com/template.pdf'
  },
  {
    name: '示例文件.pdf',
    url: 'https://example.com/template.pdf'
  },
  {
    name: '示例文件.xlsx',
    url: 'https://example.com/template.xlsx'
  },
  {
    name: '示例文件.docx',
    url: 'https://example.com/template.docx'
  },
  {
    name: '示例文件.pptx',
    url: 'https://example.com/template.pptx'
  },
  {
    name: '示例文件.zip',
    url: 'https://example.com/template.zip'
  },
  {
    name: '示例文件.rar',
    url: 'https://example.com/template.rar'
  },
  {
    name: '示例文件.txt',
    url: 'https://example.com/template.txt'
  },
  {
    name: '示例文件.mp3',
    url: 'https://example.com/template.mp3'
  },
  {
    name: '示例文件.mp4',
    url: 'https://example.com/template.mp4'
  },
  {
    name: '示例文件.csv',
    url: 'https://example.com/template.csv'
  },
  {
    name: '示例文件.vue',
    url: 'https://example.com/template.vue'
  },
  {
    name: '示例文件.ts',
    url: 'https://example.com/template.ts'
  },
  {
    name: '示例文件.js',
    url: 'https://example.com/template.js'
  },
  {
    name: '示例文件.html',
    url: 'https://example.com/template.html'
  },
  {
    name: '示例文件.css',
    url: 'https://example.com/template.css'
  },
  {
    name: '示例文件.psd',
    url: 'https://example.com/template.psd'
  },
  {
    name: '示例文件.ai',
    url: 'https://example.com/template.ai'
  },
  {
    name: '示例文件.md',
    url: 'https://example.com/template.md'
  },
  {
    name: '示例文件.yml',
    url: 'https://example.com/template.yml'
  },
  {
    name: '未知类型文件',
    url: 'https://example.com/template'
  }
])

function handleUpdate() {
  basicFiles.value = [
    {
      id: 1,
      name: '新的图片1.png',
      url: 'https://picsum.photos/600/400'
    },
    {
      id: 2,
      name: '新的图片2.png',
      url: 'https://picsum.photos/600/400'
    }
  ]
}
// 示例图和模板
const exampleImages = [
  {
    name: '示例图1',
    url: 'https://picsum.photos/600/400'
  },
  {
    name: '示例图2',
    url: 'https://picsum.photos/600/400'
  }
]
const fileTemplates = [
  { name: '模板1.xlsx', url: 'https://example.com/template1.xlsx' },
  { name: '模板2.docx', url: 'https://example.com/template2.docx' },
  { name: '模板3.pdf', url: 'https://example.com/template3.pdf' }
]

// 模拟上传函数
async function handleUpload(file: UploadRawFile): Promise<UploadFile | false> {
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 模拟上传成功
  const uploadedFile: UploadFile = {
    id: Date.now(),
    name: file.name,
    url: URL.createObjectURL(file),
    size: file.size,
    uploadTime: new Date().toLocaleString()
  }

  Message.success(`${file.name} 上传成功`)
  return uploadedFile
}
</script>
