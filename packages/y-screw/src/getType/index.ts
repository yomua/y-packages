import { JSValueType } from '../index.d'

export default function getType<T>(data: T): JSValueType {
  const type = Object.prototype.toString
    .call(data)
    .replace(/\[?\]?/g, '') // 如: 'object String'
    .replace('object ', '') // 如: String
    .replace(/\w/, (r: string) => r.toLowerCase()) as JSValueType // 如: string

  return type
}
