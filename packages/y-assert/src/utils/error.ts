import zhCN from '../assets/locales/zh-CN.json'

import { getLocales } from './index'
import AssertError from '../class/AssertError'

export function getErrorMessage(
  key: keyof typeof zhCN,
  extraMessage: string = '',
) {
  const locales: typeof zhCN = getLocales()

  return `\x1b[41m${locales[key] + extraMessage}\x1b[0m` // 红色背景
}

export function throwError(message: string | null) {
  throw new AssertError(message)
}
