import type { ChalkInstance } from 'chalk'
import type HTTP from 'http'

export type JSType =
  | string
  | number
  | boolean
  | undefined
  | null
  | bigint
  | symbol
  | object
  | Function

export type LogType =
  | 'dir'
  | 'error'
  | 'group'
  | 'table'
  | 'log'
  | 'warn'
  | 'info'
  | 'success'

export type LogGroupSub =
  | {
      message: JSType
      type?: LogType | 'trace'
    }
  | {
      message: {
        title: string
        sub: LogGroupSub[]
      }
      type: 'group'
    }

export type RequestConfig_Options =
  | RequestInit // browser
  | HTTP.RequestOptions // node
  | undefined

export type RequestConfig = {
  url?: string
  isRequest?: boolean
  options?: RequestConfig_Options
  data?: any // 请求体的数据, 若有, 则会将此数据发送到服务端
  onError?: (error: Error) => void
  onSuccess?: (res: any[] | Response) => void
  onReceiver?: (chunk: any) => any // node; return any => 作为 res 给 onSuccess
}

export type WriteConfig = {
  isWrite: boolean
  filePath: string
  filename: string
  fileSuffix: string
}

type TLog = {
  // 主体函数
  (...messages: string[]): void

  // 染色
  dye: {
    info: (...messages: string[]) => string
    error: (...messages: string[]) => string
    success: (...messages: string[]) => string
    warning: (...messages: string[]) => string
    hex: (color: string) => ChalkInstance
    rgb: (red: number, green: number, blue: number) => ChalkInstance
    bgHex: (color: string) => ChalkInstance
    bgRgb: (red: number, green: number, blue: number) => ChalkInstance
  }

  // 风格
  style: {
    reset: (...messages: string[]) => string
    bold: (...messages: string[]) => string
    dim: (...messages: string[]) => string
    italic: (...messages: string[]) => string
    underline: (...messages: string[]) => string
    overline: (...messages: string[]) => string
    inverse: (...messages: string[]) => string
    hidden: (...messages: string[]) => string
    strikethrough: (...messages: string[]) => string
    visible: (...messages: string[]) => string
  }

  // 16 进制
  hex: (color: string) => ChalkInstance

  // rgb
  rgb: (r: number, g: number, b: number) => ChalkInstance

  // 逃生到 chalk
  chalk: ChalkInstance

  // 主动写入数据到磁盘 - 由 log.writeConfig 配置
  write: (data: string) => void

  // 主动发送请求 - 由 log.requestConfig 配置
  request: (
    url: string,
    config?: Omit<RequestConfig, 'url' | 'isRequest'>,
  ) => void

  // 直接调用便输出
  group(title: string, sub: LogGroupSub[]): void
  table<T>(data: T): void
  error<T>(...data: T[]): void
  dir<T>(data: T): void

  // 写入本地磁盘的配置
  writeConfig: {
    isWrite: boolean
    filePath: string
    filename: string
    fileSuffix: string
  }

  // 发送请求配置
  requestConfig: RequestConfig
}

declare const TLog: TLog

export { TLog as default }
