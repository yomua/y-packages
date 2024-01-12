export type Log = {
  (...messages: string[]): void
  info(...messages: string[]): string
  error(...messages: string[]): string
  success(...messages: string[]): string
}

type TLog = {
  (...messages: string[]): void
  info(...messages: string[]): string
  error(...messages: string[]): string
  success(...messages: string[]): string
}

const TLog: TLog

export { TLog as default }
