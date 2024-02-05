import assert from '@yomua/y-assert'

import { isType } from '#test/index.mjs'

const { expect } = assert

expect(isType([], 'array')).equal(true)
expect(isType({}, 'object')).equal(true)

expect(isType(1, 'number')).equal(true)
expect(isType('yomua', 'string')).equal(true)
expect(isType(true, 'boolean')).equal(true)
expect(isType(Symbol(1), 'symbol')).equal(true)
expect(isType(null, 'null')).equal(true)
expect(isType(undefined, 'undefined')).equal(true)
expect(isType(BigInt(1), 'bigInt')).equal(true)

expect(isType(function () {}, 'function')).equal(true)
expect(isType(async function () {}, 'asyncFunction')).equal(true)
