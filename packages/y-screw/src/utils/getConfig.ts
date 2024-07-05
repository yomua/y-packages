import fs from 'fs'

const PROJECT_ROOT = process.cwd() // 如: D:/code/y-packages/packages/y-screw

type Result = {
  locale: 'zh' | 'en'
}

const DEFAULT_CONFIG = {
  locale: 'en',
}

export default function getConfig(): Result {
  const content = fs.readFileSync(PROJECT_ROOT + '/screw.config.json', 'utf-8')

  const result = JSON.parse(content)

  return {
    ...DEFAULT_CONFIG,
    ...result,
  }
}
