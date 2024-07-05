import type { Options as MemoizeFnOptions } from './allEnv/memoizeFn'
import type { Task as LimitPromiseTask } from './allEnv/limitPromise'

export function addBigNumbers(initNumber?: string): {
  add(num: string): typeof addBigNumbers
  get(): string
}

export type JSValueType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'undefined'
  | 'bigInt'
  | 'symbol'
  | 'object'
  | 'array'
  | 'function'

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

export function debounce<T = () => void>(
  fn: T,
  delay: number,
  option?: {
    isRefreshItself?: boolean
  },
): (...rest: any[]) => void

export function getType<T>(
  data: T,
):
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'undefined'
  | 'bigInt'
  | 'symbol'
  | 'object'
  | 'array'
  | 'function'

export function isEmptyObject(obj: Record<string, any>): boolean

export function isNil<T>(value: T | null | undefined): value is null | undefined

export function limitPromise(
  limitCount: number,
): (taskFn: LimitPromiseTask) => Promise<unknown>

export function memoizeFnValue<Args, FnResult>(
  fn: (...args: Args[]) => FnResult,
  options?: {
    maxAge?: number
  },
): {
  (...args: Args[]): any
  cache: Map<any, any>
}

export function memoizeFn(
  fn: {
    (...args: any[]): void
    cache?: Map<any, (...args: any[]) => void> | undefined
  },
  options?: MemoizeFnOptions,
): {
  (...args: any[]): void
  cache?: Map<any, (...args: any[]) => void> | undefined
}

export function throttle<T = () => void>(
  fn: T,
  delay: number,
): (...rest: any[]) => void

export function urlChange(
  url: string,
  options?: {
    state?: any
    go?: boolean
  },
): void

export function isType<T>(value: any, type: JSValueType): value is T

export function toJSON(data: JSType | JSType[]): JSON
