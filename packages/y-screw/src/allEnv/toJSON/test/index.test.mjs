import assert from '@yomua/y-assert'

import { toJSON } from '#test/index.mjs'

const { expect } = assert

const symbol1 = Symbol(1)

// 原始值
expect(toJSON(1)).equal('1')
expect(toJSON(true)).equal('true')

// Symbol, BigInt (也是原始值, 不过在这里将它们独立书写, 以便阅读)
expect(toJSON(symbol1)).equal('Symbol(1)')
expect(toJSON({ [symbol1]: '1' })).equal('{"Symbol(1)":"1"}')
expect(toJSON([{ [symbol1]: 1 }])).equal('[{"Symbol(1)":1}]')
expect(toJSON(BigInt(1111111111111111))).equal('1111111111111111')

// undefined (所有 undefined, 最后都会被转为 null 显示)
expect(toJSON(undefined)).equal(null)
expect(toJSON()).equal(null)
expect(toJSON({ name: undefined })).equal('{"name":null}')
expect(toJSON([undefined])).equal('[null]')
expect(toJSON([[undefined]])).equal('[[null]]')
expect(toJSON([{ name: undefined }])).equal('[{"name":null}]')

// null
expect(toJSON(null)).equal(null)
expect(toJSON([null])).equal('[null]')
expect(toJSON({ name: null })).equal('{"name":null}')
expect(toJSON({ obj: { name: null } })).equal('{"obj":{"name":null}}')

// 函数
expect(toJSON(function () {})).equal('function () {}')
expect(toJSON([function () {}])).equal('["function () {}"]')

// 数组
expect(toJSON([1, 2, 3])).equal(JSON.stringify([1, 2, 3]))
expect(toJSON([null])).equal(JSON.stringify([null]))
expect(toJSON([undefined])).equal(JSON.stringify([undefined]))
expect(toJSON([null, undefined])).equal(JSON.stringify([null, undefined]))
expect(toJSON([[1, 2, 3]])).equal(JSON.stringify([[1, 2, 3]]))
expect(toJSON([{ name: 'yomua' }])).equal(JSON.stringify([{ name: 'yomua' }]))
expect(toJSON([{ obj: { name: 'yomua' } }])).equal(
  JSON.stringify([{ obj: { name: 'yomua' } }]),
)

// 对象
// 将双引号改成单引号就会报错; 但是实际使用时没有问题
// 因为这里实际上会被转为字符串比较, 所以错一个字符都会报错, 这是正常的.
expect(toJSON({ name: 'yomua' })).equal(JSON.stringify({ name: 'yomua' }))
expect(toJSON({ obj: { age: '18' } })).equal(
  JSON.stringify({ obj: { age: '18' } }),
)
expect(toJSON({ arr: ['yomua'] })).equal(JSON.stringify({ arr: ['yomua'] }))
expect(toJSON({ arr: [{ name: 'yomua' }] })).equal(
  JSON.stringify({ arr: [{ name: 'yomua' }] }),
)

// 各种值混合测试
expect(
  toJSON({
    arr: [
      1,
      '2',
      'true',
      true, 
      null, // null
      undefined, // null
      NaN, // nul
      symbol1, // 保留 symbol 值:  Symbol(1)
      { name: 'yomua' },
      [1, 2, 3, { name: 'yomua' }],
    ],
  }),
).equal(
  '{"arr":[1,"2","true",true,null,null,null,"Symbol(1)",{"name":"yomua"},[1,2,3,{"name":"yomua"}]]}',
)
