import assert from '@yomua/y-assert'

import { getType } from '#test/index.mjs'

const { expect } = assert

expect(getType([])).equal('array')
expect(getType({})).equal('object')

expect(getType(1)).equal('number')
expect(getType('yomua')).equal('string')
expect(getType(true)).equal('boolean')
expect(getType(Symbol(1))).equal('symbol')
expect(getType(null)).equal('null')
expect(getType(undefined)).equal('undefined')
expect(getType(BigInt(1))).equal('bigInt')

expect(getType(function () {})).equal('function')
