import assert from '@yomua/y-assert'

import { memoizeFnValue } from '#test/index.mjs'

const { expect } = assert

let i = 0

function increasing() {
  i += 1

  return i
}

const cache1 = memoizeFnValue(increasing)

// 连续调用 3 次, 仍然和第一次计算的值相等
expect(cache1()).equal(1)
expect(cache1()).equal(1)
expect(cache1()).equal(1)

// 具有有效期, 且为 0s; 即不会缓存
const increasing2 = memoizeFnValue(increasing, { maxAge: 0 })
expect(increasing2()).equal(2)
expect(increasing2()).equal(3)
expect(increasing2()).equal(4)

// 具有有效期, 且为 1s; 
// 注意: 这是持续性的缓存, 即: 每 maxAge 秒后, 都会重新计算值, 并缓存 maxAge 秒, 直到过期, 如此反复
;(async function () {
  const increasing3 = memoizeFnValue(increasing, { maxAge: 1 })
  expect(increasing3()).equal(5) // 得到新值后, 缓存函数值
  expect(increasing3()).equal(5) // 使用缓存值

  // 会等待 1s, 才继续往下执行
  await new Promise((resolve) => {
    return setTimeout(() => {
      // 1秒后缓存到期, 重新计算函数值并缓存, 这里新值为: 6
      // TIP: 当缓存到期, 得到新值后, 又会重新以当前时间戳 + maxAge 计算缓存时间.
      expect(increasing3()).equal(6)
      resolve()
    }, 1000)
  })

  expect(increasing3()).equal(6) // 使用新缓存值: 6

  await new Promise((resolve) => {
    return setTimeout(() => {
      // 1秒后缓存又到期, 又重新计算函数值并缓存, 这里新值为: 7
      expect(increasing3()).equal(7)
      resolve()
    }, 1000)
  })

  expect(increasing3()).equal(7) // 在没有过期之前, 这里将一直会使用缓存值: 7
})()
