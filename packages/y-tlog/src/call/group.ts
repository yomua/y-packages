import write from '../write.js'
import { isPrimitive } from '../utils.js'

export default function (
  title: string,
  sub: {
    message: any
  }[],
) {
  let writeMessage = ''

  console.group(title)
  writeMessage += `${title}\n`

  sub.forEach((item) => {
    const { message } = item
    if (isPrimitive(message)) {
      console.log(message)
      writeMessage += `  ${message}\n`
    } else {
      console.dir(message)
      writeMessage += `  ${JSON.stringify(message)}\n`
    }
  })
  console.groupEnd()

  // 删除最后一个换行符
  writeMessage = writeMessage.trim().replace(/\\n$/, '')

  write(writeMessage)
}
