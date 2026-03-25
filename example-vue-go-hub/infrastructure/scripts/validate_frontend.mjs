import { existsSync } from 'node:fs'

console.log('Validating frontend structure...')

const required = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'src/main.ts',
  'src/App.vue',
  'src/assets/main.css',
]

let failed = false

for (const path of required) {
  if (!existsSync(path)) {
    console.log(`MISSING: ${path}`)
    failed = true
  }
}

if (failed) {
  console.log('Validation failed. See missing files above.')
  process.exit(1)
}

console.log('Frontend structure is valid.')
