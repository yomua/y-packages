import write from '../utils/write'
import request from '../utils/request'

export default function <T>(data: T) {
  console.table(data)

  request(null, { data })

  write(JSON.stringify(data))
}
