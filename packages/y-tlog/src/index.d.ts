import type { ChalkInstance } from 'chalk'

type TLog = {
  (...messages: string[]): void
  dye: {
    info: (...messages: string[]) => string
    error: (...messages: string[]) => string
    success: (...messages: string[]) => string
    warning: (...messages: string[]) => string
  }
  write: (data: string) => void
  writeConfig: {
    isWrite: boolean
    filePath: string
    filename: string
    fileSuffix: string
  }
  group(
    title: string,
    sub: {
      message: any
    }[],
  ): void
  table<T>(data: T): void
  error<T>(...data: T[]): void
  dir<T>(data: T): void
  hex: (color: string) => ChalkInstance
  rgb: (r: number, g: number, b: number) => ChalkInstance
}

declare const TLog: TLog

export { TLog as default }
