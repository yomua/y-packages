import flag from '../utils/flag'

import equal from './methods/equal'
import typeOf from './methods/typeOf'
import { EXPECT_KEY } from './constants'

// 单实例
class ExpectClass {
  private static _instance: ExpectClass

  // 始终使用 source 重新赋值,
  // 即: 每次 new ExpectClass() 都会赋值, 相当于每次调用 except(value) 都会给 EXPECT_KEY 赋值为 value
  // 即使为 undefined, null, 0, '', false 也仍然会赋值.
  constructor(source?: any) {
    if (ExpectClass._instance) {
      flag(ExpectClass._instance, EXPECT_KEY, source)
      return ExpectClass._instance
    }

    flag(this, EXPECT_KEY, source)
    ExpectClass._instance = this

    return ExpectClass._instance
  }

  // 解决: 如果我们只是单纯想要获取 ExpectClass 的实例, 而不是重新为实例绑定的 __flags[EXPECT_KEY] 赋值
  static _getInstance() {
    if (ExpectClass._instance) {
      return ExpectClass._instance
    }

    throw new Error('ExpectClass 需要先 new, 再调用 ExpectClass._getInstance()')
  }

  equal(target: any) {
    return equal(target)
  }

  typeOf(target: any) {
    return typeOf(target)
  }
}

export default ExpectClass
