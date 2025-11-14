import { JSType } from '../../index.d'

import isType from '../isType'

/**
 * null: 将 null 视为 null
 * undefined: 将 undefined 视为 null
 *
 * function: 将 function 做 toString() 处理
 * symbol: 将 symbol 做 toString() 处理
 * bigint: 将 bigint 做 toString() 处理
 *
 * 对象, 数组中, 含以上值, 也进行特殊处理
 * 其他都和 JSON.stringify() 保持一致
 */
export default function toJSON(data: JSType | JSType[]): JSON {
  if (isType<JSType[]>(data, 'array')) {
    // 对数组每一项进行处理, 最后再对数组本身进行 JSON.stringify
    return JSON.stringify(
      data.map((d: JSType | JSType[]) => {
        // 数组中的数字, 布尔值, 字符串不进行任何处理, 和 JSON.stringify() 保持一致
        if (
          isType(d, 'number') ||
          isType(d, 'boolean') ||
          isType(d, 'string')
        ) {
          return d
        }

        // toJSON 处理
        if (
          isType(d, 'bigInt') || // stringify 不会对此处理
          isType(d, 'symbol') || // stringify 不会对此处理
          isType(d, 'function') || // stringify(function(){}) => undefined; stringify([function(){}]) => '[null]'
          isType(d, 'undefined') || // stringify(undefined) => undefined; stringify([undefined]) => '[null]'
          isType(d, 'null') // stringify(null) => null; stringify([null]) => '[null]'
        ) {
          return toJSON(d)
        }

        // 还剩 array, object

        /** 
         *  JSON.parse 的目的:
         *   => 因为在最外层, 我们还会对数组本身进行一次 JSON.stringify
         *   => 若不进行 JSON.parse, 且传过来的数组中包含对象, 数组,
         *   => 那么 toJSON 会将对象格式化 '{"name":"yomua"}' 这样的形式
         *   => 放入数组中再序列化就会成为: '[ "{"name":"yomua"}" ]' 这样的形式
         *   => 这就改变了数组中对象的格式, 变成了字符串, 那么就和 JSON.stringify() 结果无法保持一致
         *   => JSON.stringify([{}]) => '[{}]', 如果不在这里 parse, 最终的结果会是 '["{}"]'
         *   => 这不是我们想要的, 所以需要再一次 JSON.parse
         *
         */
        return JSON.parse(toJSON(d) as unknown as string)
      }),
    ) as unknown as JSON
  }

  if (isType<object>(data, 'object')) {
    // 手动对对象进行 JSON 化, 因为对象可能包含函数或 Symbol
    // 注意, 这里除了特殊处理的 Symbol, BigInt, Function 外,
    // 其最终得到的其他格式完全等于 JSON.stringify 后得到的格式
    let result = '{'

    const keys = Reflect.ownKeys(data)

    keys.forEach((key, index) => {
      // 将 undefined, null 都转为 null, 因为 JSON 格式来说, undefined 不是有效值.
      const value = data[key] ?? null

      let tailComma = index === keys.length - 1 ? '' : ','

      /**
       * 为什么要再一次对原始值 value 进行 JSON.stringify ?
       * 拼接字符串时, '{' + 'name' + ':yomua' + '}'
       * => 得到: '{name:yomua,}' , 而不是 '{"name":"yomua"}'
       * => 因为拼接的时候, 会将所拼接的字符串合并成一个字符串, 会脱掉字符串本最外层的引号
       * => 如果想要字符串拼接的时候, 得到如 '"name"' 这样的形式, 你必须为被拼接的字符串再次字符串化.
       */
      const activeValue = toJSON(value)

      // 拼接  key:value
      result += toJSON(String(key)) + `:${activeValue}${tailComma}`

      if (index === keys.length - 1) {
        result += '}'
      }
    })

    return result as unknown as JSON
  }

  // null, undefined
  if (isType<null>(data, 'null') || isType<undefined>(data, 'undefined')) {
    // 不论是 undefined 还是 null, 都返回 null
    // undefined 不是一个有效值, 对于 JSON 格式来说.
    return (data ?? null) as unknown as JSON
  }

  // Function || Symbol || BigInt
  if (
    isType<Function>(data, 'function') ||
    isType<Symbol>(data, 'symbol') ||
    isType<BigInt>(data, 'bigInt')
  ) {
    return data?.toString() as unknown as JSON
  }

  return JSON.stringify(data) as unknown as JSON
}
