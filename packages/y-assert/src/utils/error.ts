import log from '@yomua/y-tlog'

import zhCN from '../assets/locales/zh-CN.json'

import { getLocales } from './index'
import AssertError from '../class/AssertError'

const { dye } = log

export function getErrorMessage(key: keyof typeof zhCN, extraMessage: string = '') {
  const locales: typeof zhCN = getLocales()

  return dye.bgRgb(255, 0, 0)(locales[key] + extraMessage)
}

export function throwError(message: string) {
  throw new AssertError(message)
}
