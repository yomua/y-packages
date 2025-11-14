import assert from '#test/index.mjs'

const { expect } = assert

expect(null).typeOf('null')
expect(undefined).typeOf('undefined')

expect('').typeOf('string')
expect(0).typeOf('number')
expect(true).typeOf('boolean')
expect(BigInt(1)).typeOf('bigInt')
expect(Symbol(1)).typeOf('symbol')

expect(() => {}).typeOf('function')
expect({}).typeOf('object')
expect([]).typeOf('array')
