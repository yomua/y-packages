import screwConfig from '../../screw.config.json'

const PROJECT_ROOT = process.cwd() // 如: D:/code/y-packages/packages/y-screw

type Result = {
  locale: 'zh' | 'en'
}

const DEFAULT_CONFIG = {
  locale: 'en',
}

export default function getConfig(): Result {
  const result = screwConfig as {
    locale: 'zh' | 'en'
  }
  
  return {
    ...DEFAULT_CONFIG,
    ...result,
  }
}
