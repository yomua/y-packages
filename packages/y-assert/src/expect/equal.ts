import { getType, isType } from '@yomua/y-screw'

import flag from '../utils/flag'
import AssertMessage from '../class/AssertMessage'
import { throwError, getErrorMessage } from '../utils/error'
import { getExpectInstance, isPrimitive } from '../utils/index'

import { EXPECT_KEY } from './constants'

const message = new AssertMessage()

export default function equal(target: any) {
  // 不更改 flag(instance, EXPECT_KEY) 的值的情况下, 得到实例
  const instance = getExpectInstance()

  const value = flag(instance, EXPECT_KEY)

  // 类型比较
  if (getType(value) !== getType(target)) {
    // 对 array 或 对象进行递归比较时, 类型若不匹配, 则直接使用一开始假定的错误的消息.
    throwError(
      message.error ??
        getErrorMessage(
          'expect.equal.type.error',
          `: ${getType(value)} !== ${getType(target)}`,
        ),
    )
  }

  // 数组比较
  if (isType<any[]>(value, 'array') && isType<any[]>(target, 'array')) {
    const valueLength = value.length

    const targetLength = target.length

    // 数组长度比较
    if (valueLength !== targetLength) {
      message.error = getErrorMessage(
        'expect.equal.array.length.error',
        `: ${valueLength} !== ${targetLength}`,
      )

      throwError(message.error)
    }

    // 对数组每项递归比较
    for (let i = 0; i < valueLength; i++) {
      const targetItem = target[i]

      const valueItem = value[i]

      // 先假定设置一个错误: 数组项不匹配
      // 会如果后续递归时, 没有报错, 则此错误也不会触发.
      // 如果报错了, 则此错误触发
      message.error = getErrorMessage(
        'expect.equal.array.item.error',
        // TIP: item 可能是 Symbol, 需要使用 .toString()
        `: ${valueItem?.toString() ?? valueItem} !== ${
          targetItem?.toString() ?? targetItem
        }`,
      )

      // 重设 value, 递归时会获取到此值作为 source, 再继续和 target 比较
      flag(instance, EXPECT_KEY, valueItem)

      equal(targetItem)
    }

    // 如果递归结束, 执行到此行, 说明数组的每一项都匹配
    return true
  }

  // 对象比较
  if (isType<object>(value, 'object') && isType<object>(target, 'object')) {
    // ownKeys: 可以得到 Symbol 类型的键
    const valueKeys = Reflect.ownKeys(value)
    const targetKeys = Reflect.ownKeys(target)

    // 对象 key 长度比较
    if (valueKeys.length !== targetKeys.length) {
      message.error = getErrorMessage(
        'expect.equal.object.key.length.error',
        `: ${valueKeys.length} !== ${targetKeys.length}`,
      )

      throwError(message.error)
    }

    // 对对象每个 key 和 value 进行递归比较
    for (let i = 0; i < valueKeys.length; i++) {
      const valueKey = valueKeys[i]

      const targetKey = targetKeys[i]

      // 比较 key
      if (!Object.is(valueKey, targetKey)) {
        message.error = getErrorMessage(
          'expect.equal.object.key.error',
          `: ${valueKey?.toString() ?? valueKey} !== ${
            targetKey?.toString() ?? targetKey
          }`,
        )

        throwError(message.error)
      }

      const valueItem = value[valueKey]

      const targetItem = target[targetKey]

      // 先假定设置一个错误: 对象值不匹配
      // 如果后续递归时, 没有报错, 则此错误也不会触发.
      // 如果报错了, 则此错误会触发
      message.error = getErrorMessage(
        'expect.equal.object.value.error',
        `: ${valueItem} 不等于 ${targetItem}`,
      )

      // 重设 value, 递归时会获取到此值作为 source, 再继续和 target 比较
      flag(instance, EXPECT_KEY, valueItem)

      equal(targetItem)
    }

    return true
  }

  // null 比较
  if (isType<null>(value, 'null') && isType<null>(target, 'null')) {
    return true
  }

  // 原始值比较
  // => 在这里将 Symbol() 返回的值也认为是原始值
  if (isPrimitive(value) && isPrimitive(target)) {
    if (!Object.is(value, target)) {
      // 对 array 或 对象进行递归比较时, 值若不匹配, 则直接使用一开始假定的错误的消息.
      throwError(
        message.error ??
          getErrorMessage(
            'expect.equal.value.error',
            `: ${String(value)} !== ${String(target)}`,
          ),
      )
    }

    return true
  }

  throwError(
    getErrorMessage(
      'expect.equal.unknown.error',
      `: source: ${value}, target: ${target}`,
    ),
  )
}
