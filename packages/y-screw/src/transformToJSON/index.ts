import isType from '../isType'
import { JSType } from '../index.d'

export default function transformToJSON(data: JSType | JSType[]): JSON {
  if (Array.isArray(data)) {
    return JSON.stringify(
      data.map((d: JSType | JSType[]) => transformToJSON(d)),
    ) as unknown as JSON
  }

  if (isType<object>(data, 'object')) {
    let result = '{'

    const keys = Reflect.ownKeys(data)

    keys.forEach((key, index) => {
      const value = data[key]

      let tailComma = index === keys.length - 1 ? '' : ', '

      result +=
        JSON.stringify(String(key)) + `:${transformToJSON(value)}${tailComma}`

      if (index === keys.length - 1) {
        result += '}'
      }
    })

    return result as unknown as JSON
  }

  if (typeof data === 'function' || typeof data === 'symbol') {
    return data?.toString() as unknown as JSON
  }

  if (typeof data === 'undefined') {
    // 对 "undefined" 再一次 stringify, 这样当 return data 为 JSON 时, 使用 JSON.parse({a: undefined}) 才不会报错
    return JSON.stringify('undefined') as unknown as JSON
  }

  return JSON.stringify(data) as unknown as JSON
}
