import { isType } from '@yomua/y-screw'
import { JSType } from '../index.d'

export function getEnv() {
  try {
    if (window && document) {
      return 'browser'
    }
  } catch (error) {
    return 'node'
  }

  return 'unknown'
}

// 目前此方法不支持写入 key 是 Symbol 的对象
export function transformToStrForLog(
  data: JSType | JSType[],
  options?: { separator: string },
) {
  if (Array.isArray(data)) {
    return data
      .map((d) => transformToStrForLog(d))
      .join(options?.separator ?? ' ')
  }

  if (isType<object>(data, 'object')) {
    const keys = Reflect.ownKeys(data)

    keys.forEach((key, index) => {
      const value = data[key]

      if (typeof key === 'symbol') {
        return
      }
    })
  }

  if (typeof data === 'string') {
    return data
  }

  if (typeof data === 'function' || typeof data === 'symbol') {
    return data?.toString()
  }

  if (typeof data === 'undefined') {
    return 'undefined'
  }

  return JSON.stringify(data)
}

export function polyfillConsole() {
  if (!console.dir) {
    console.dir = function <T>(data: T) {
      console.log(data)
    }
  }

  if (!console.group || !console.groupEnd) {
    console.group = function (title: string) {
      console.log(title)
    }

    console.groupEnd = function () {
      console.log('')
    }
  }

  if (!console.table) {
    console.table = function <T>(data: T) {
      console.log(data)
    }
  }

  if (!console.error) {
    console.error = function (...messages: string[]) {
      console.log(messages.join(''))
    }
  }
}
