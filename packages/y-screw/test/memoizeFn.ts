// 在线例子: https://codesandbox.io/p/sandbox/memoizefn-8yth7j?file=%2Fsrc%2FApp.tsx
import memoizeFn from '../src/memoizeFn'

let i = 0
let j = 0

function increasing1(...rest) {
    return ++i // 先自增再作为值返回;  ++i => 先返回当前值然后再自增
}

function increasing2(...rest) {
    return ++j
}

// memoizeFn 返回的函数指向的是你传进来的函数 increasing1
const memo1 = memoizeFn(increasing1, { resolver: '123' })
const memo2 = memoizeFn(increasing1, { resolver: '456' })

// 只对函数进行缓存, 不会对值进行缓存; 若想要对值进行缓存, Refer: memoize
console.log(memo1(1, 2, 3)) // 1
console.log(memo1(1, 2, 3)) // 2

// 即使 key 不一样, 但是由于 memo 的是同一个函数, memoizeFn 返回函数就是这同一个函数, 所以返回 true
console.log(memo1 === memo2) // true

console.log('----------------------------')

// 由于 cache 是声明在全局内存中, 所以调用 memoizeFn 时, cache 都指向同一个
// 所以若有相同的 key, 则后面出现的一样的 key 将会被忽略
// 所以 memoizeFn 返回的函数将指向 cache.get(resolver) => 这里就是 increasing1
const memo3 = memoizeFn(increasing2, { resolver: '123' })
const memo4 = memoizeFn(increasing2, { resolver: '456' })

// memo3, memo4 是 increasing1, 不是 increasing2
console.log(memo3()) // 3
console.log(memo4()) // 4
