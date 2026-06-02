<template>
  <div class="icon-demo-grid">
    <div v-for="icon in iconList" :key="icon.name" class="icon-demo-item">
      <AbIcon :icon="icon.name" :size="32" />
      <span>{{ icon.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AbIcon } from '@/components/Icon'

const iconList = [
  { name: 'ep:user', label: '用户' },
  { name: 'ep:setting', label: '设置' },
  { name: 'ep:search', label: '搜索' },
  { name: 'ep:edit', label: '编辑' },
  { name: 'ep:download', label: '下载' },
  { name: 'ep:warning', label: '警告' }
]
</script>

<style scoped>
.icon-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.icon-demo-item {
  min-height: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  color: var(--color-text-2);
}
</style>
