import assert from '#test/index.mjs'

const { expect } = assert

const symbol1 = Symbol(1)

const fn = () => {}

// null, undefined
expect(null).equal(null)
expect(undefined).equal(undefined)
expect().equal() // 什么都不传, 就是 undefined

// 原始值
expect(1).equal(1)
expect('').equal('')
expect('yomua').equal('yomua')
expect(true).equal(true)
expect(symbol1).equal(symbol1)

// 函数
expect(fn).equal(fn)

// 对象
expect({}).equal({})
expect({
  // 对象顺序必须一样
  name: 'yomua',
  [symbol1]: 'symbol1',
  hobby: { game: true, code: true },
  ages: [18, 20, 22, 24, 26],
  info: [
    {
      phone: '123',
    },
  ],
}).equal({
  name: 'yomua',
  [symbol1]: 'symbol1',
  hobby: { game: true, code: true },
  ages: [18, 20, 22, 24, 26],
  info: [
    {
      phone: '123',
    },
  ],
})

// 数组
expect([]).equal([])
expect([null]).equal([null])
expect([undefined]).equal([undefined])
expect([symbol1]).equal([symbol1])
expect([1, 2, 3]).equal([1, 2, 3])
expect([{ name: 'yomua', hobby: { game: true } }, 2]).equal([
  { name: 'yomua', hobby: { game: true } },
  2,
])
