<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>图标组件</h2>
      <p>基于 Iconify 的图标组件，支持海量图标库</p>
    </div>

    <el-card class="demo-card">
      <template #header>
        <span>常用图标示例</span>
      </template>

      <div class="icon-grid">
        <div v-for="icon in iconList" :key="icon.name" class="icon-item">
          <AbIcon :icon="icon.name" :size="32" />
          <span class="icon-name">{{ icon.label }}</span>
        </div>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>不同尺寸</span>
      </template>

      <div class="icon-sizes">
        <AbIcon icon="ep:user" :size="16" />
        <AbIcon icon="ep:user" :size="24" />
        <AbIcon icon="ep:user" :size="32" />
        <AbIcon icon="ep:user" :size="48" />
        <AbIcon icon="ep:user" :size="64" />
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>不同颜色</span>
      </template>

      <div class="icon-colors">
        <AbIcon icon="ep:star-filled" :size="32" color="#409eff" />
        <AbIcon icon="ep:star-filled" :size="32" color="#67c23a" />
        <AbIcon icon="ep:star-filled" :size="32" color="#e6a23c" />
        <AbIcon icon="ep:star-filled" :size="32" color="#f56c6c" />
        <AbIcon icon="ep:star-filled" :size="32" color="#909399" />
      </div>
    </el-card>

    <el-card class="demo-card feature-card">
      <template #header>
        <span>✨ 核心特性</span>
      </template>
      <ul class="feature-list">
        <li>🎨 支持 Iconify 全部图标库（10万+ 图标）</li>
        <li>📏 灵活的尺寸设置</li>
        <li>🌈 自定义颜色</li>
        <li>⚡ 按需加载，性能优秀</li>
        <li>🔄 支持旋转、翻转等变换</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { AbIcon } from '@/index'

const iconList = [
  { name: 'ep:user', label: '用户' },
  { name: 'ep:setting', label: '设置' },
  { name: 'ep:search', label: '搜索' },
  { name: 'ep:edit', label: '编辑' },
  { name: 'ep:delete', label: '删除' },
  { name: 'ep:view', label: '查看' },
  { name: 'ep:download', label: '下载' },
  { name: 'ep:upload', label: '上传' },
  { name: 'ep:refresh', label: '刷新' },
  { name: 'ep:close', label: '关闭' },
  { name: 'ep:check', label: '确认' },
  { name: 'ep:warning', label: '警告' }
]
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  padding: 10px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.icon-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.icon-name {
  font-size: 12px;
  color: #606266;
}

.icon-sizes {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px;
}

.icon-colors {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px;
}
</style>
