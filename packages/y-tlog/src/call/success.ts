import dye from '../utils/dye'
import write from '../utils/write'
import request from '../utils/request'
import { IS_BROWSER, IS_NODE } from '../utils/constants'
import { transformToStrForLog } from '../utils/index'

export default function (...data: any[]) {
  data = data.map((d) => {
    if (typeof d === 'symbol') {
      return d.toString()
    }
    return d
  })

  console.log(dye.hex('#000').bgHex('#00ff00')(...data))

  request(null, { data })

  // 如果只有一个值，则写入磁盘时不需要换行
  const firstValue =
    data.length > 1 ? `\n  ${transformToStrForLog(data[0])}` : data[0]

  write(
    transformToStrForLog([firstValue, ...data.slice(1)], {
      separator: `\n  `,
    }),
    {
      type: 'success',
    },
  )
}
