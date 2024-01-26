import assert from '@yomua/y-assert'

import { transformToJSON } from '#test/index.mjs'

const data = {
  name: 'yomua',
}

const { expect } = assert
console.log(21313)

expect(transformToJSON(data)).equal(JSON.stringify(data))
