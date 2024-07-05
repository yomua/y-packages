import assert from '@yomua/y-assert'

import { isEmptyObject } from '#test/index.mjs'

const { expect } = assert

expect(isEmptyObject({})).equal(true)
expect(isEmptyObject({ a: 1 })).equal(false)
expect(
  isEmptyObject({
    [Symbol(1)]: 1,
  }),
).equal(false)
