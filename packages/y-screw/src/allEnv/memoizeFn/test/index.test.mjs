// 在线例子: https://codesandbox.io/p/sandbox/memoizefn-8yth7j?file=%2Fsrc%2FApp.tsx
import assert from '@yomua/y-assert'

import { memoizeFn } from '#test/index.mjs'

const { expect } = assert

let i = 0
function increasing1() {
  return ++i // 先自增再作为值返回;
}

// memoizeFn 返回的函数指向的是你传进来的函数 increasing1
const memo1 = memoizeFn(increasing1, { resolver: '123' })
const memo2 = memoizeFn(increasing1, { resolver: '456' })

// 只对函数进行缓存, 不会对值进行缓存; 若想要对值进行缓存, Refer: memoizeFnValue
expect(memo1()).equal(1)
expect(memo1()).equal(2) // 值会改变

// 即使 key 不一样, 但是由于 memo 的是同一个函数, memoizeFn 返回函数就是这同一个函数, 所以返回 true
expect(memo1).equal(memo2)

// console.log('----------------------------')

let j = 0
function increasing2() {
  return ++j
}

/**
 * 由于 cache 是声明在全局内存中, 所以调用 memoizeFn 时, cache 都指向同一个
 * 所以若有相同的 key, 则后面出现的一样的 key 将会被忽略
 * 所以 memoizeFn 返回的函数将指向 cache.get(resolver) => 这里就是 increasing1
 */
const memo3 = memoizeFn(increasing2, { resolver: '123' })
const memo4 = memoizeFn(increasing2, { resolver: '456' })

// memo3, memo4 是 increasing1, 不是 increasing2
// 所以不是使用 j 进行计算
expect(memo3()).equal(3)
expect(memo4()).equal(4)

// 相同而 key, 只会记录第一个出现的 key
expect(memo3).equal(memo1)
expect(memo4).equal(memo2)

// console.log('----------------------------')

// 不指定 key, 自动使用 hashString 进行计算,
// 这会使得缓存不同函数时, 后面出现的函数不会被忽略, 将会单独保存
// 但是相同函数, 得到的 hash key 仍然是一样的
let y = 0
function increasing3() {
  return ++y
}
const memo5 = memoizeFn(increasing3)
const memo6 = memoizeFn(increasing3)
expect(memo5()).equal(1)
expect(memo6()).equal(2)

let z = 0
function increasing4() {
  return ++z
}

// 这里和 memo5, memo6 一样没有使用 key, 但是新函数会被单独缓存; 这里的 memo7 和 memo8 不会被忽略
// 因为 key 不同, 由  memoizeFn 自动计算
const memo7 = memoizeFn(increasing4)
const memo8 = memoizeFn(increasing4)
expect(memo7()).equal(1)
expect(memo8()).equal(2)
