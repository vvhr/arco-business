import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const demosDir = join(rootDir, 'docs/src/demos')

async function findFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(entry => {
      const entryPath = join(dir, entry.name)
      return entry.isDirectory() ? findFiles(entryPath) : [entryPath]
    })
  )
  return files.flat()
}

const files = await findFiles(demosDir)
const sharedFiles = files.filter(filePath => basename(filePath) === 'shared.ts')

assert.deepEqual(
  sharedFiles.map(filePath => filePath.replace(rootDir, '').replace(/^[\\/]/, '')),
  [],
  'docs demos must not contain shared.ts files'
)

for (const filePath of files.filter(filePath => extname(filePath) === '.vue')) {
  const source = await readFile(filePath, 'utf8')
  assert.doesNotMatch(
    source,
    /from\s+['"]\.\/shared(?:\.ts)?['"]/,
    `${filePath.replace(rootDir, '').replace(/^[\\/]/, '')} must be standalone`
  )
}
