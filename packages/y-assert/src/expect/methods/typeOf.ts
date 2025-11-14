import { JSValueType, getType } from '@yomua/y-screw'

import flag from '../../utils/flag'
import { getExpectInstance } from '../../utils/index'
import { throwError, getErrorMessage } from '../../utils/error'

import { EXPECT_KEY } from '../constants'

export default function typeOf(type: JSValueType) {
  // 不更改 flag(instance, EXPECT_KEY) 的值的情况下, 得到实例
  const instance = getExpectInstance()

  // 调用 except(value) 设置的值
  const value = flag(instance, EXPECT_KEY)

  if (getType(value) !== type) {
    throwError(
      getErrorMessage(
        'expect.equal.type.error',
        `: ${getType(value)} !== ${type}`,
      ),
    )
  }

  return true
}
