import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

const rootDir = resolve(__dirname, '..')

export default defineConfig({
  root: __dirname,
  plugins: [
    UnoCSS(),
    vue(),
    vueJsx({
      transformOn: true,
      mergeProps: false
    }),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      resolvers: [ArcoResolver()],
      dts: 'src/types/auto-imports.d.ts'
    }),
    Components({
      dirs: [],
      resolvers: [ArcoResolver({ sideEffect: true })],
      dts: 'src/types/components.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
      '~': rootDir,
      '@docs': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8989,
    open: true
  },
  build: {
    outDir: resolve(rootDir, 'dist-docs'),
    emptyOutDir: true,
    sourcemap: true
  }
})
