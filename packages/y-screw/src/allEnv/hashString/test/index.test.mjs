import assert from '@yomua/y-assert'

import { hashString } from '#test/index.mjs'

const { expect } = assert

// 顶层使用 await
// https://nodejs.org/docs/latest/api/esm.html#top-level-await
const value = await hashString('yomua')

expect(value).equal(
  'e80789d2f56d544c268e51bccb69ae9d0650f77b4646467fc9ea51c3874ebec6',
)

expect(value).typeOf('string')
