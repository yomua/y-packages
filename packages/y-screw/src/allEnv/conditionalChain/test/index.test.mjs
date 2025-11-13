import assert from '@yomua/y-assert'

import { conditionalChain } from '#test/index.mjs'

const { expect } = assert

// 对字符串进行判断
expect(conditionalChain().cond('a').cond('b').cond('c').get()).equal(undefined)
expect(conditionalChain().cond('a').r('r1').get()).equal('r1')

// 对布尔值进行判断
expect(conditionalChain().cond(false).cond(true).r('r1').r('r2').get()).equal(
  'r2',
)

// 对表达式进行判断
expect(
  conditionalChain()
    .cond(1 === 0)
    .r('r1')
    .cond(1 === 1)
    .r('r2')
    .get(),
).equal('r2')

// 对函数表达式进行判断
expect(
  conditionalChain()
    .cond(() => true)
    .r('r1')
    .cond(() => false)
    .r('r2')
    .get(),
).equal('r1')

// 条件没有一个为 true, 则会返回 undefined
expect(conditionalChain().cond(true).get()).equal(undefined)

// 条件没有一个为 true, 但使用了 default, 则会返回 default() 设置的值
expect(
  conditionalChain()
    .default('default1')
    .cond(false)
    .default('default2')
    .r('r1')
    .get(),
).equal('default2')

// 条件全为 true, 则返回第一个 true 对应的值
expect(
  conditionalChain()
    .cond(true)
    .r('r1')
    .cond(true)
    .r('r2')
    .get(),
).equal('r1')

