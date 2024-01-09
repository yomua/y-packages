export type ClassNamesType =
  | string
  | number
  | undefined
  | Record<string, unknown> // unknown: 可以是任何值, 因为这里只用 key 来获取值是否存在, 从而将 key 放入 class
  | Array<ClassNamesType>

export default function classnames(...args: ClassNamesType[]): string
