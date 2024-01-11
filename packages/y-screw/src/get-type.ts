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

export default function getType<T>(data: T):
    | 'string' // 这样写类型, 能直接使用时看到
    | 'number'
    | 'boolean'
    | 'null'
    | 'undefined'
    | 'bigInt'
    | 'symbol'
    | 'object'
    | 'array'
    | 'function' {
    const type = Object.prototype.toString
        .call(data)
        .replace(/\[?\]?/g, '') // 'object String'
        .replace('object ', '') // String
        .replace(/\w/, (r) => r.toLowerCase()) as JSValueType // string

    return type
}
