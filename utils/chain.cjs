const { isType } = require('@yomua/y-screw')
const log = require('@yomua/y-tlog')

const { dye } = log

class Chain {
  // 存放函数的栈
  _receiversStack = []

  // 存放参数
  _args = new Map()

  constructor() {
    this._receiversStack = []
    this._args = new Map()
  }

  /**
   * 指定下一个使用函数去处理请求
   * @param {Function | AsyncFunction} entrustNext
   * @param  {...any} rest
   */
  setReceiver(entrustNext, ...rest) {
    if (
      !isType(entrustNext, 'asyncFunction') &&
      !isType(entrustNext, 'function')
    ) {
      throw new Error(dye.error('setReceiver 接收的参数预期是一个函数'))
    }

    this._receiversStack.push(entrustNext)
    this._args.set(entrustNext, rest)
  }

  /**
   * 向职责链发送请求，并让职责链上的对象处理
   * @returns {Promise<({message: string } | any )[]>}
   */
  async passRequest() {
    let isNext = true
    const result = []

    while (isNext) {
      // 取出最先入栈的函数
      const fn = this._receiversStack.shift()

      // 约定每一个被指定的函数, 都会返回一个对象: {message: string},
      // => 如果 message 是 'next', 则将请求委托给下一个函数处理
      // => 否则直接返回
      const res = await fn?.apply(this, this._args.get(fn))

      const { message = '' } = res ?? {}

      result.push(res)

      isNext = message === 'next'
    }

    return result
  }
}

module.exports = Chain
