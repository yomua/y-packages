import memoize from '../src/memoize-fn-value'

let i = 0

function increasing() {
    i += 1

    return i
}

const increasing1 = memoize(increasing)

console.log(increasing1()) // 1
console.log(increasing1()) // 1
console.log(increasing1()) // 1

const increasing2 = memoize(increasing, { maxAge: 0 })
console.log(increasing2()) // 2
console.log(increasing2()) // 3
console.log(increasing2()) // 4

const increasing3 = memoize(increasing, { maxAge: 1 })
console.log(increasing3()) // 5
console.log(increasing3()) // 5
setTimeout(() => {
    // 1秒后缓存到期, 所以此时这里得到的数字为 6
    console.log(increasing3()) // 6
}, 1000)
