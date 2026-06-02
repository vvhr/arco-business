import { existsSync, statSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const requiredFiles = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/style.css',
  'global.d.ts',
  'README.md',
  'LICENSE',
  'CHANGELOG.md'
]

const missingFiles = requiredFiles.filter(file => {
  const fullPath = resolve(rootDir, file)
  return !existsSync(fullPath) || !statSync(fullPath).isFile()
})

if (missingFiles.length) {
  console.error('[arco-business] Missing package files:')
  missingFiles.forEach(file => console.error(`- ${file}`))
  console.error('\nRun `pnpm build` before packing or publishing.')
  process.exit(1)
}

console.log('[arco-business] Package files check passed.')
