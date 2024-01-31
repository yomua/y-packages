import log from '@yomua/y-tlog'

// 当前环境是否支持 Error.captureStackTrace
const canElideFrames = 'captureStackTrace' in Error

const { dye } = log

class AssertError extends Error {
  get name() {
    return dye.error('AssertError')
  }

  constructor(
    message = 'Unspecified AssertError',
    extraInstanceProps = {},
    captureStackTraceFn: Function = AssertError,
  ) {
    super(message)

    if (canElideFrames) {
      /**
       * 返回一个带有堆栈信息的错误消息
       * Ref: https://v8.dev/docs/stack-trace-api#stack-trace-collection-for-custom-exceptions
       * 将堆栈属性添加到给定 error 对象;
       * @params error 指定的对象
       * @params captureStackTrace 可选的; constructorOpt 参数允许您传递函数值。收集堆栈跟踪时，此函数最顶层调用（包括该调用）之上的所有帧都会被排除在堆栈跟踪之外。这对于隐藏对用户没有用处的实现细节非常有用。定义捕获堆栈跟踪的自定义错误的常用方法是
       * @return undefined
       */
      Error.captureStackTrace(this, captureStackTraceFn)
    }

    // 将 extraInstanceProps 挂载到当前实例
    for (const key in extraInstanceProps) {
      if (!(key in this)) {
        this[key] = extraInstanceProps[key]
      }
    }
  }

  // 得到实例的源信息 - 以对象的形式
  toOriginal(stack: boolean) {
    return {
      ...this,
      name: this.name,
      message: this.message,
      stack: stack !== false ? this.stack : undefined,
    }
  }
}

export default AssertError
