<template>
  <PageHeader eyebrow="Guide" title="扩展图标" description="AbIcon 基于 Iconify，支持注册单个图标或完整自定义图标集。" :tags="['Iconify', 'custom collection', 'AbIcon']" />

  <SectionBlock id="extend-icons-install" kicker="Install" title="安装时注册图标集" description="适合业务系统内置的私有图标集，注册后可直接使用 prefix:name。">
    <div class="docs-callout">
      <pre class="docs-code-inline">import AcroBusiness from 'arco-business'

app.use(AcroBusiness, {
  iconCollections: [{
    prefix: 'biz',
    icons: {
      approve: { body: '&lt;path d="M4 12l4 4L20 6"/&gt;' }
    }
  }]
})</pre>
    </div>
  </SectionBlock>

  <SectionBlock id="extend-icons-runtime" kicker="Runtime" title="运行时注册" description="工具函数来自 Iconify 数据结构，适合按模块延迟加载图标。">
    <div class="docs-callout">
      <pre class="docs-code-inline">import { addIcon, addIconCollection, addIconCollections } from 'arco-business'

addIcon('biz:approve', { body: '&lt;path d="M4 12l4 4L20 6"/&gt;' })</pre>
    </div>
  </SectionBlock>

  <SectionBlock id="extend-icons-use" kicker="Usage" title="在组件中使用" description="注册后的图标可用于 AbIcon、AbText icon、TableAction icon 和任何支持 Iconify 名称的配置项。">
    <div class="docs-callout">
      <pre class="docs-code-inline">&lt;AbIcon icon="biz:approve" :size="18" /&gt;

const action = { label: '审批', name: 'approve', icon: 'biz:approve' }</pre>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
</script>
