import assert from '@yomua/y-assert'

import { isNil } from '#test/index.mjs'

const { expect } = assert

expect(isNil(null)).equal(true)
expect(isNil(undefined)).equal(true)
expect(isNil({})).equal(false)
