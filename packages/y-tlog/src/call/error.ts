import write from '../utils/write'
import request from '../utils/request'

export default function (...data: any[]) {
  console.error(...data)

  request(null, { data })

  write(JSON.stringify(data))
}
