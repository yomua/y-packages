import chalk from 'chalk'

import { getEnv } from './index'

// 有时, console.log(chalk[key]) 似乎并不能正确显示颜色, 使用此方法手动设置
const insertAsciiColor = (key: string) => {
  // ['length', 'name', Symbol(GENERATOR), Symbol(STYLER), Symbol(IS_EMPTY)]
  const keys = Reflect.ownKeys(chalk[key])
  const styleKey = keys[3] as Symbol

  const color = chalk[key][styleKey] as {
    open: string
    close: string
    openAll: string
    closeAll: string
    parent: unknown
  }

  return (message: string) => {
    return `${color?.open ?? ''}${message}${color?.close ?? ''}`
  }
}

export const CHALK_COLOR_MAP = {
  error: (message: string) => insertAsciiColor('red')(message),
  info: (message: string) => insertAsciiColor('white')(message),
  success: (message: string) => insertAsciiColor('green')(message),
  warning: (message: string) => insertAsciiColor('yellow')(message),
  hex: chalk.hex,
  rgb: chalk.rgb,
  bgHex: chalk.bgHex,
  bgRgb: chalk.bgRgb,
}

export const IS_BROWSER = getEnv() === 'browser'
export const IS_NODE = getEnv() === 'node'
