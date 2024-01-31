import enUS from '../assets/locales/en-US.json'
import zhCN from '../assets/locales/zh-CN.json'
import ExpectClass from '../expect/ExpectClass'
import assert from '../index'

export function isPrimitive(
  value: any,
): value is string | number | boolean | undefined | symbol | Function {
  return typeof value !== 'object' && value !== null
}

export function getLocales() {
  switch (assert.locales) {
    case 'zh-CN':
      return zhCN
    case 'en-US':
      return enUS
    default:
      return zhCN
  }
}

export function getExpectInstance() {
  return ExpectClass._getInstance()
}
