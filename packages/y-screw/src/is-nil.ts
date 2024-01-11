import getType from './get-type'

// 类型谓词: value is null | undefined
// => https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export default function <T>(
    value: T | null | undefined,
): value is null | undefined {
    return getType(value) === 'null' || getType(value) === 'undefined'
}
