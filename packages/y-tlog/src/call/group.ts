import dye from '../utils/dye'
import write from '../utils/write'
import style from '../utils/style'
import request from '../utils/request'
import { transformToStrForLog } from '../utils'
import { IS_BROWSER, IS_NODE } from '../utils/constants'
import type { LogGroupSub } from '../index.d'

function warn(...data: any[]) {
  if (IS_BROWSER) {
    console.warn(...data)
    return
  }

  if (IS_NODE) {
    console.log(dye.hex('#000').bgHex('#fffb00')(...data))
    return
  }

  console.warn(...data)
}

function error(...data: any[]) {
  if (IS_BROWSER) {
    console.error(...data)
    return
  }

  if (IS_NODE) {
    console.log(dye.hex('#000').bgHex('#ff0000')(...data))
    return
  }

  console.error(...data)
}

const cons = { ...console, warn, error }

export default function group(title: string, sub: LogGroupSub[]) {
  let writeMessage = ''

  cons.group(style.bold(title))
  writeMessage += `${title}\n`

  sub.forEach((item) => {
    const { message, type = 'log' } = item

    // 子项 type 是 group, 则递归打印
    if (type === 'group' && !!message && typeof message === 'object') {
      const mes = message as {
        title: string
        sub: LogGroupSub[]
      }

      group(mes?.title, mes?.sub)
    }

    // 子项 type 是 group, 则当前项 message 不打印, 且不输出到 log 文件
    // => 因为这个 message 会是对象, 将用来递归打印
    if (type !== 'group') {
      cons[type](message)

      writeMessage += '  ' + transformToStrForLog(message) + '\n'
    }
  })

  cons.groupEnd()

  // 删除最后一个换行符
  writeMessage = writeMessage.trim().replace(/\\n$/, '')

  request(null, { data: writeMessage })

  write(writeMessage, {
    type: 'group',
  })
}
