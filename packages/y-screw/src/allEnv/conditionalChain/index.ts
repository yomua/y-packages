type Result = any
type Cond = any

type Condition = { condition: Cond; index: number }

type Chain = {
  conditionMap: Condition[]
  resultMap: unknown[]
  activeResult: Result

  default(result: Result): Chain
  cond(condition: Cond): Chain
  r(result: Result): Chain
  get(): Result
}

const conditionalChain = (
  cm: Condition[] = [],
  rm: unknown[] = [],
  r: Result = undefined,
): Chain => {
  // 存储 cond(condition) 时的 condition
  let conditionMap = cm

  // 存储 r(result) 时的 result
  let resultMap = rm

  // 最终 get() 会返回的结果
  let activeResult = r

  return {
    // 把这些数据返回暴露到外面
    conditionMap,
    resultMap,
    activeResult,

    default<T>(result: T) {
      activeResult = result

      return conditionalChain(conditionMap, resultMap, result)
    },

    cond<T>(condition: T): Chain {
      if (!activeResult) {
        // 获取当前条件出现的位置
        // 当前条件还未 push 进入数组, 所以此次长度获取的是不包含当前条件的长度
        const index = conditionMap.length

        conditionMap.push({
          condition,
          index,
        })
      }

      return conditionalChain(conditionMap, resultMap, activeResult)
    },

    r<T>(result: T): Chain {
      resultMap.push(result)

      if (conditionMap.length > 0) {
        conditionMap.forEach((item) => {
          const rIndex = resultMap.length - 1

          // 调用 r 函数得到当前结果时, 判断 condition 是否为 true
          // true => 判断此结果是否和 conditionMap 出现的位置是否对应
          //   对应 => 将结果赋值给 activeResult
          if (!!item.condition && rIndex === item.index) {
            activeResult = resultMap[item.index]
            conditionMap = []
          }
        })
      }

      return conditionalChain(conditionMap, resultMap, activeResult)
    },

    get() {
      return activeResult
    },
  }
}

export default conditionalChain
