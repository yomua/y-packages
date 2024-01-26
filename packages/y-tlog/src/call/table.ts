import write from '../utils/write'
import request from '../utils/request'
import { transformToStrForLog } from '../utils'

import { JSType } from '../index.d'

export default function <T>(data: T[]) {
  console.table(data)

  request(null, { data })

  write(transformToStrForLog(data as JSType[]), {
    type: 'table',
  })
}
