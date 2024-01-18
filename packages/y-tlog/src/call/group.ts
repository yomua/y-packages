import write from '../utils/write'
import request from '../utils/request'
import style from '../utils/style'
import { isPrimitive, isSymbol } from '../utils'
import type { LogGroupSub } from '../index.d'

export default function group(title: string, sub: LogGroupSub[]) {
  let writeMessage = ''

  console.group(style.bold(title))
  writeMessage += `${title}\n`

  sub.forEach((item) => {
    const { message, type = 'log' } = item

    // 子项 type 是 group, 则递归打印
    if (type === 'group' && !!message && typeof message === 'object') {
      const m = message as {
        title: string
        sub: LogGroupSub[]
      }

      group(m?.title, m?.sub)
    }

    // 子项 type 是 group, 则当前项 message 不打印, 且不输出到 log 文件
    // => 因为这个 message 会是对象, 将用来递归打印
    if (type !== 'group') {
      console[type](message)

      if (isPrimitive(message)) {
        writeMessage += `  ${message}\n`
      } else if (isSymbol(message)) {
        // 使用模板语法会导致 Symbol 类型的值累加不上(变成 undefined -> `${Symbol()1} 是 undefined`)
        writeMessage += '  ' + String(message) + '\n'
      } else {
        writeMessage += `  ${JSON.stringify(message)}\n`
      }
    }
  })

  console.groupEnd()

  // 删除最后一个换行符
  writeMessage = writeMessage.trim().replace(/\\n$/, '')

  request(null, { data: writeMessage })

  write(writeMessage)
}
