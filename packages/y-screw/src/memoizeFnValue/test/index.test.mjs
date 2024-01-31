import assert from '@yomua/y-assert'

import { memoizeFnValue } from '#test/index.mjs'

const { expect } = assert

let i = 0

function increasing() {
  i += 1

  return i
}

const increasing1 = memoizeFnValue(increasing)

// 连续调用 3 次, 仍然和第一次计算的值
expect(increasing1()).equal(1)
expect(increasing1()).equal(1)
expect(increasing1()).equal(1)

// 具有有效期, 且为 0s
const increasing2 = memoizeFnValue(increasing, { maxAge: 0 })
expect(increasing2()).equal(2)
expect(increasing2()).equal(3)
expect(increasing2()).equal(4)

// 具有有效期, 且为 1s
const increasing3 = memoizeFnValue(increasing, { maxAge: 1 })
expect(increasing3()).equal(5)
expect(increasing3()).equal(5)
setTimeout(() => {
  // 1秒后缓存到期, 所以此时这里得到的数字为 6
  expect(increasing3()).equal(6)
}, 1000)
