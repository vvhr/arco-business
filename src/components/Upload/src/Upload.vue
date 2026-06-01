<template>
  <div class="ab-upload" :class="`ab-upload--${size}`">
    <!-- 示例图和模板 -->
    <div v-if="examples?.length || templates?.length" class="ab-upload__header">
      <span v-if="examples?.length" class="ab-upload__link" @click="handleViewExamples">
        {{ t('upload.viewExamples') }}
      </span>
      <Dropdown v-if="templates?.length" @select="handleDownloadTemplate">
        <span class="ab-upload__link">
          {{ t('upload.downloadTemplate') }}
          <IconDown class="ab-upload__link-icon" />
        </span>
        <template #content>
          <Doption v-for="(template, index) in templates" :key="index" :value="template">
            {{ template.name }}
          </Doption>
        </template>
      </Dropdown>
    </div>

    <!-- 文件列表 -->
    <div class="ab-upload__list" :class="`ab-upload__list--${listType}`">
      <!-- picture 模式 -->
      <template v-if="listType === 'picture'">
        <div
          v-for="item in internalFileList"
          :key="item.uid"
          class="ab-upload__item ab-upload__item--picture"
        >
          <div class="ab-upload__item-content">
            <!-- 图片预览 -->
            <img
              v-if="
                item.data &&
                isImageFile(getFileUrl(item.data), getFileName(item.data)) &&
                !item.imageLoadError
              "
              :src="getFileUrl(item.data)"
              alt=""
              :style="{ objectFit: objectFit }"
              class="ab-upload__image"
              @click="handlePreview(item.data!)"
              @error="handleImageError(item)"
            />
            <!-- 非图片文件或图片加载失败 -->
            <div v-else class="ab-upload__file-icon" @click="item.data && handlePreview(item.data)">
              <AbIcon
                :size="pictureFileIconSize"
                :icon="getFileIcon(getFileUrl(item.data), getFileName(item.data))"
              />
              <div class="ab-upload__file-name">{{ item.data ? getFileName(item.data) : '' }}</div>
            </div>

            <!-- loading 状态 -->
            <div v-if="item.status === 'uploading'" class="ab-upload__loading">
              <IconLoading class="ab-upload__spin" :size="24" />
            </div>

            <!-- hover 遮罩 -->
            <div v-if="item.status === 'success'" class="ab-upload__mask">
              <IconZoomIn
                v-if="previewable"
                :size="20"
                @click="item.data && handlePreview(item.data)"
              />
              <IconDownload
                v-if="downloadable && disabled"
                :size="20"
                @click="item.data && handleDownload(item.data)"
              />
              <IconDelete v-if="!disabled" :size="20" @click="handleRemove(item)" />
            </div>
          </div>
        </div>
        <!-- 非编辑模式且无任何文件时 -->
        <div
          v-if="disabled && internalFileList.length === 0"
          class="ab-upload__item ab-upload__item--picture"
        >
          <div class="flex flex-col items-center justify-center h-full gap-1 is-empty">
            <IconFileImage :size="pictureFileIconSize" />
            <span class="empty-text">{{ t('upload.empty') }}</span>
          </div>
        </div>
        <!-- 上传按钮 -->
        <div
          v-if="showUploadButton"
          class="ab-upload__trigger ab-upload__trigger--picture"
          @click="handleTriggerClick"
        >
          <IconPlus :size="iconSize" />
        </div>
      </template>

      <!-- text 模式 -->
      <template v-else>
        <div
          v-for="item in internalFileList"
          :key="item.uid"
          class="ab-upload__item ab-upload__item--text"
        >
          <AbIcon
            class="ab-upload__item-icon"
            :size="listFileIconSize"
            :icon="getFileIcon(getFileUrl(item.data), getFileName(item.data))"
          />
          <span class="ab-upload__item-name">
            {{ item.data ? getFileName(item.data) : '' }}
          </span>
          <IconLoading
            v-if="item.status === 'uploading'"
            class="ab-upload__item-loading ab-upload__spin"
            :size="16"
          />
          <div v-if="item.status === 'success'" class="ab-upload__item-actions">
            <IconZoomIn
              v-if="previewable"
              class="ab-upload__item-action"
              :size="16"
              @click="item.data && handlePreview(item.data)"
            />
            <IconDownload
              v-if="downloadable && disabled"
              class="ab-upload__item-action"
              :size="16"
              @click="item.data && handleDownload(item.data)"
            />
            <IconClose
              v-if="!disabled"
              class="ab-upload__item-delete"
              :size="16"
              @click="handleRemove(item)"
            />
          </div>
        </div>

        <!-- 非编辑模式且无任何文件时 -->
        <div
          v-if="disabled && internalFileList.length === 0"
          class="ab-upload__item ab-upload__item--text"
        >
          <div class="flex flex-row items-center justify-center w-full gap-1 is-empty">
            <span>{{ t('upload.empty') }}</span>
          </div>
        </div>
        <!-- 上传按钮 -->
        <div
          v-if="showUploadButton"
          class="ab-upload__trigger ab-upload__trigger--text"
          @click="handleTriggerClick"
        >
          <IconUpload :size="16" />
          <span>{{ t('upload.button') }}</span>
        </div>
      </template>
    </div>

    <!-- 提示文字 -->
    <div v-if="tips || $slots.tip" class="ab-upload__tips">
      <slot name="tip">{{ tips }}</slot>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input
      ref="inputRef"
      type="file"
      class="ab-upload__input"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileChange"
    />

    <!-- 图片预览 -->
    <ImagePreviewGroup
      v-if="showImageViewer"
      v-model:visible="showImageViewer"
      v-model:current="previewIndex"
      :src-list="previewImages"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AbIcon } from '@/components/Icon'
import { Dropdown, Doption, ImagePreviewGroup, Message } from '@arco-design/web-vue'
import { logger, t } from '@/locale'
import {
  IconClose,
  IconDelete,
  IconDown,
  IconDownload,
  IconFileImage,
  IconLoading,
  IconPlus,
  IconUpload,
  IconZoomIn
} from '@arco-design/web-vue/es/icon'
import type {
  UploadProps,
  UploadEmits,
  InternalUploadFile,
  UploadFile,
  FileTemplate
} from './types'
import {
  generateUid,
  isImageFile,
  getFileValue,
  checkFileSize,
  parseSizeLimit,
  formatFileSize,
  isImageFileByType,
  compressImage,
  getFileIcon
} from './utils'

defineOptions({
  name: 'AbUpload'
})

const props = withDefaults(defineProps<UploadProps>(), {
  modelValue: () => [],
  fileKeys: () => ({ name: 'name', url: 'url' }),
  multiple: false,
  disabled: false,
  listType: 'picture',
  size: 'default',
  objectFit: 'cover',
  autoCompress: false,
  previewable: true,
  downloadable: false
})

const emit = defineEmits<UploadEmits>()

// refs
const inputRef = ref<HTMLInputElement>()
const internalFileList = ref<InternalUploadFile[]>([])
const showImageViewer = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

// computed
const showUploadButton = computed(() => {
  if (props.disabled) return false
  if (!props.limit) return true
  return internalFileList.value.filter(item => item.status === 'success').length < props.limit
})

const iconSize = computed(() => {
  const sizeMap = { small: 16, default: 20, large: 24 }
  return sizeMap[props.size]
})
const pictureFileIconSize = computed(() => {
  const sizeMap = { small: 24, default: 48, large: 96 }
  return sizeMap[props.size]
})
const listFileIconSize = computed(() => {
  const sizeMap = { small: 18, default: 20, large: 22 }
  return sizeMap[props.size]
})

// 同步 modelValue 到内部文件列表
watch(
  () => props.modelValue,
  newVal => {
    if (!newVal) return
    internalFileList.value = newVal.map(file => ({
      uid: generateUid(),
      status: 'success' as const,
      data: file,
      imageLoadError: false
    }))
  },
  { immediate: true, deep: true }
)

// methods
function getFileName(file: UploadFile): string {
  return getFileValue(file, props.fileKeys, 'name')
}

function getFileUrl(file: UploadFile): string {
  return getFileValue(file, props.fileKeys, 'url')
}

function handleTriggerClick() {
  inputRef.value?.click()
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (!files.length) return

  // 检查数量限制
  if (props.limit) {
    const currentCount = internalFileList.value.filter(item => item.status === 'success').length
    const availableCount = props.limit - currentCount

    if (files.length > availableCount) {
      Message.warning(t('upload.fileCountLimit', { limit: props.limit }))
      files.splice(availableCount)
    }
  }

  // 处理每个文件
  for (const file of files) {
    await processFile(file)
  }

  // 清空 input
  target.value = ''
}

async function processFile(file: File) {
  let rawFile = file as any
  rawFile.uid = generateUid()
  // before-upload 钩子
  if (props.beforeUpload) {
    try {
      const result = await props.beforeUpload(rawFile)
      if (result === false) return
    } catch {
      return
    }
  }
  // 自动压缩图片
  if (props.autoCompress && isImageFileByType(rawFile)) {
    try {
      const compressedFile = await compressImage(rawFile)
      // 保留原始的 uid
      const uid = rawFile.uid
      rawFile = compressedFile as any
      rawFile.uid = uid
    } catch (error) {
      logger.error('console.upload.compressError', undefined, error)
      // 压缩失败，继续使用原文件
    }
  }
  // 检查文件大小（压缩后）
  if (props.sizeLimit && !checkFileSize(rawFile, props.sizeLimit)) {
    const limit = parseSizeLimit(props.sizeLimit)
    Message.error(t('upload.fileSizeLimit', { size: formatFileSize(limit) }))
    return
  }
  // 添加到列表（uploading 状态）
  const internalFile: InternalUploadFile = {
    uid: rawFile.uid,
    status: 'uploading',
    rawFile,
    data: {},
    imageLoadError: false
  }
  internalFileList.value.push(internalFile)
  // 调用上传函数
  if (!props.upload) {
    Message.error(t('upload.uploadFunctionRequired'))
    internalFileList.value = internalFileList.value.filter(item => item.uid !== internalFile.uid)
    return
  }
  try {
    const result = await props.upload(rawFile)

    if (result === false) {
      // 上传失败，移除文件
      internalFileList.value = internalFileList.value.filter(item => item.uid !== internalFile.uid)
    } else {
      // 上传成功
      internalFile.status = 'success'
      internalFile.data = result

      // 更新 modelValue
      updateModelValue()

      // 触发事件
      emit('upload', result)
      emit('change', getSuccessFiles())
    }
  } catch (e) {
    console.error('[AbUpload] exception in upload:', e)
    // 上传失败，移除文件
    internalFileList.value = internalFileList.value.filter(item => item.uid !== internalFile.uid)
  }
}

async function handleRemove(item: InternalUploadFile) {
  if (!item.data) return

  // before-remove 钩子
  if (props.beforeRemove) {
    try {
      const result = await props.beforeRemove(item.data)
      if (result === false) return
    } catch {
      return
    }
  }

  // 从列表中移除
  internalFileList.value = internalFileList.value.filter(f => f.uid !== item.uid)

  // 更新 modelValue
  updateModelValue()

  // 触发事件
  emit('remove', item.data)
  emit('change', getSuccessFiles())
}

function handlePreview(file: UploadFile) {
  // 如果用户自定义了预览方法，使用自定义方法
  if (props.preview) {
    props.preview(file)
    return
  }

  // 默认预览逻辑
  const url = getFileUrl(file)
  const fileName = getFileName(file)

  if (isImageFile(url, fileName)) {
    // 图片预览
    const imageFiles = internalFileList.value
      .filter(item => item.data && isImageFile(getFileUrl(item.data), getFileName(item.data)))
      .map(item => getFileUrl(item.data!))

    previewImages.value = imageFiles
    previewIndex.value = imageFiles.indexOf(url)
    showImageViewer.value = true
  } else {
    Message.info(t('upload.previewNotSupported'))
    // 非图片文件，触发 preview 事件
    emit('preview', file)
  }
}

function handleViewExamples() {
  if (!props.examples?.length) return
  previewImages.value = props.examples.map(item => item.url)
  previewIndex.value = 0
  showImageViewer.value = true
}

function handleDownloadTemplate(template: FileTemplate) {
  if (props.downloadTemplate) {
    props.downloadTemplate(template)
  } else {
    window.open(template.url, '_blank')
  }
}

function handleDownload(file: UploadFile) {
  // 如果用户自定义了下载方法，使用自定义方法
  if (props.downloadFile) {
    props.downloadFile(file)
    return
  }

  // 默认下载逻辑
  const url = getFileUrl(file)
  if (!url) {
    Message.warning(t('upload.downloadNotSupported'))
    return
  }

  // 创建 a 标签触发下载
  const link = document.createElement('a')
  link.href = url
  link.download = getFileName(file) || 'download'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getSuccessFiles(): UploadFile[] {
  return internalFileList.value
    .filter(item => item.status === 'success' && item.data)
    .map(item => item.data!)
}

function updateModelValue() {
  emit('update:modelValue', getSuccessFiles())
}

function handleImageError(item: InternalUploadFile) {
  // 图片加载失败，标记为错误状态，显示为文件图标
  item.imageLoadError = true
}
</script>

<style scoped lang="less">
.ab-upload {
  width: 100%;

  &__header {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
  }

  &__link {
    color: rgb(var(--primary-6));
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  &__link-icon {
    font-size: 14px;
  }

  &__list {
    display: flex;

    &--picture {
      flex-wrap: wrap;
      gap: 12px;
    }

    &--text {
      flex-direction: column;
      gap: 8px;
    }
  }

  &__item {
    &--picture {
      position: relative;
      width: 128px;
      height: 128px;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
      overflow: hidden;
      cursor: pointer;
      .is-empty {
        color: var(--color-text-3);
        font-size: 14px;
        .empty-text {
          line-height: 14px;
        }
      }
    }

    &--text {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--color-fill-2);
      }

      .is-empty {
        color: var(--color-text-2);
      }
    }
  }

  &__item-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__file-icon {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    box-sizing: border-box;
  }

  &__file-name {
    font-size: 12px;
    color: var(--color-text-3);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);

    color: rgb(var(--primary-6));
  }

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    opacity: 0;
    transition: opacity 0.3s;

    .arco-icon {
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  &__item--picture:hover &__mask {
    opacity: 1;
  }

  &__item-icon {
    font-size: 20px;
    color: var(--color-text-3);
  }

  &__item-name {
    flex: 1;
    font-size: 14px;
    color: var(--color-text-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__item-action {
    font-size: 16px;
    color: var(--color-text-3);
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: rgb(var(--primary-6));
    }
  }

  &__item-loading {
    font-size: 16px;
    color: rgb(var(--primary-6));
  }

  &__item-delete {
    font-size: 16px;
    color: var(--color-text-3);
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: rgb(var(--danger-6));
    }
  }

  &__trigger {
    cursor: pointer;
    transition: all 0.3s;

    &--picture {
      width: 128px;
      height: 128px;
      border: 1px dashed var(--color-border-2);
      border-radius: var(--border-radius-small);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-3);

      &:hover {
        border-color: rgb(var(--primary-6));
        color: rgb(var(--primary-6));
      }
    }

    &--text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 40px;
      padding: 8px 12px;
      border: 1px dashed var(--color-border-2);
      border-radius: var(--border-radius-small);
      color: var(--color-text-2);

      &:hover {
        border-color: rgb(var(--primary-6));
        color: rgb(var(--primary-6));
      }
    }
  }

  &__tips {
    margin-top: 8px;
    font-size: 12px;
    color: var(--color-text-3);
    line-height: 1.5;
  }

  &__input {
    display: none;
  }

  &__spin {
    animation: ab-upload-spin 1s linear infinite;
  }

  // 尺寸变体
  &--small {
    .ab-upload__file-icon {
      padding: 2px;
      gap: 2px;
    }

    .ab-upload__file-name {
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }

    .ab-upload__item--picture {
      width: 64px;
      height: 64px;
      .is-empty {
        font-size: 12px;
        .empty-text {
          line-height: 12px;
        }
      }
    }

    .ab-upload__trigger--picture {
      width: 64px;
      height: 64px;
    }

    .ab-upload__item--text {
      height: 32px;
      padding: 6px 8px;
      font-size: 12px;
      .is-empty {
        font-size: 12px;
      }
    }

    .ab-upload__trigger--text {
      height: 32px;
      padding: 6px 8px;
      font-size: 12px;
    }

    .ab-upload__list--picture {
      gap: 8px;
    }

    .ab-upload__file-name {
      font-size: 10px;
    }
  }

  &--large {
    .ab-upload__item--picture {
      width: 256px;
      height: 256px;
    }

    .ab-upload__trigger--picture {
      width: 256px;
      height: 256px;
      .is-empty {
        font-size: 14px;
        .empty-text {
          line-height: 14px;
        }
      }
    }

    .ab-upload__item--text {
      height: 48px;
      padding: 10px 16px;
      font-size: 16px;
      .is-empty {
        font-size: 16px;
      }
    }

    .ab-upload__trigger--text {
      height: 48px;
      padding: 10px 16px;
      font-size: 16px;
    }

    .ab-upload__list--picture {
      gap: 16px;
    }

    .ab-upload__file-name {
      font-size: 14px;
    }
  }
}

@keyframes ab-upload-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
