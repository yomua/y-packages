import assert from '@yomua/y-assert'

import { addBigNumbers } from '#test/index.mjs'

const { expect } = assert

expect(
  addBigNumbers('11111111111.11111111111111111111111111111111111111111111111')
    .add('22222222222.33333333333333333333333333333333333333333333333')
    .get(),
).equal('33333333333.44444444444444444444444444444444444444444444444')

expect(addBigNumbers('123').get()).equal('123')
