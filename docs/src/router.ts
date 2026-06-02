import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

export type NavItem = {
  label: string
  path: string
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: '指南',
    items: [
      { label: '介绍', path: '/guide/introduction' },
      { label: '快速开始', path: '/guide/quick-start' },
      { label: '国际化', path: '/guide/locale' },
      { label: '扩展组件', path: '/guide/extend-components' },
      { label: '扩展图标', path: '/guide/extend-icons' }
    ]
  },
  {
    title: '组件',
    items: [
      { label: 'AbForm 表单', path: '/components/form' },
      { label: 'AbTable 表格', path: '/components/table' },
      { label: 'AbIcon 图标', path: '/components/icon' },
      { label: 'AbUpload 上传', path: '/components/upload' },
      { label: 'AbModal 对话框', path: '/components/modal' },
      { label: 'AbDrawer 抽屉', path: '/components/drawer' },
      { label: 'AbText 增强文本', path: '/components/text' },
      { label: 'AbComboInput 组合输入器', path: '/components/combo-input' }
    ]
  }
]

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/HomePage.vue') },
  {
    path: '/guide/introduction',
    component: () => import('./pages/guide/Introduction.vue')
  },
  {
    path: '/guide/quick-start',
    component: () => import('./pages/guide/QuickStart.vue')
  },
  {
    path: '/guide/locale',
    component: () => import('./pages/guide/Locale.vue')
  },
  {
    path: '/guide/extend-components',
    component: () => import('./pages/guide/ExtendComponents.vue')
  },
  {
    path: '/guide/extend-icons',
    component: () => import('./pages/guide/ExtendIcons.vue')
  },
  {
    path: '/components/form',
    component: () => import('./pages/components/FormPage.vue')
  },
  {
    path: '/components/table',
    component: () => import('./pages/components/TablePage.vue')
  },
  {
    path: '/components/icon',
    component: () => import('./pages/components/IconPage.vue')
  },
  {
    path: '/components/upload',
    component: () => import('./pages/components/UploadPage.vue')
  },
  {
    path: '/components/modal',
    component: () => import('./pages/components/ModalPage.vue')
  },
  {
    path: '/components/drawer',
    component: () => import('./pages/components/DrawerPage.vue')
  },
  {
    path: '/components/text',
    component: () => import('./pages/components/TextPage.vue')
  },
  {
    path: '/components/combo-input',
    component: () => import('./pages/components/ComboInputPage.vue')
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
