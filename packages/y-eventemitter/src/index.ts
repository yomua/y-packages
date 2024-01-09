/**
 * Reference:
 * https://nodejs.org/api/events.html#events
 * http://nodejs.cn/api-v16/events.html#events
 * https://www.npmjs.com/package/eventemitter3
 */
class SingletonEventemitter {
  static instance: SingletonEventemitter

  events: { [key: string | symbol]: ((...args: any[]) => void)[] }

  constructor() {
    this.events = {}

    // 防止意外地 new
    // 理论上来说, 我们并没有暴露 SingletonEventemitter, 而是暴露 SingletonEventemitter.singleInstance
    if (!SingletonEventemitter.instance) {
      SingletonEventemitter.instance = this
    }

    return SingletonEventemitter.instance
  }

  static get singleInstance() {
    if (!this.instance) {
      this.instance = new SingletonEventemitter()
    }

    return this.instance
  }

  // 注册一个事件并添加监听器
  on<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    context?: any,
  ) {
    if (!this.events[event]) {
      this.events[event] = []
    }

    // { 'eventname':[ (...args) => { } ] }
    this.events[event].push(fn.bind(context ?? this))

    return
  }

  // 触发某个注册的事件的监听器
  emit<T extends string | symbol>(event: T, ...args: any[]) {
    this.events[event]?.forEach((fn) => {
      fn(...args)
    })
  }

  // 移除某个注册事件
  // 如果存在 fn, 则移除只移除此事件注册的 fn
  // 如果不存在 fn, 则移除此事件注册的所有的 fn
  off<T extends string | symbol>(
    event: T,
    fn?: ((...args: any[]) => void) | undefined,
    context?: any,
    once?: boolean | undefined,
  ) {
    // 只移除指定的 fn
    if (fn) {
      this.events[event] = this.events[event]?.filter((f) => f !== fn)
      return
    }

    delete this.events[event]

    return
  }

  // 移除所有事件
  removeAllListeners(event?: string | symbol | undefined) {
    this.events = {}

    return
  }
}

export default SingletonEventemitter.singleInstance
