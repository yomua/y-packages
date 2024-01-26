import { JSValueType } from '../index.d'

export default function getType<T>(data: T): JSValueType {
  const type = Object.prototype.toString
    .call(data)
    .replace(/\[?\]?/g, '') // 'object String'
    .replace('object ', '') // String
    .replace(/\w/, (r) => r.toLowerCase()) as JSValueType // string

  return type
}
