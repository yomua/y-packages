import write from '../utils/write'
import request from '../utils/request'

export default function <T>(data: T) {
  console.dir(data)

  request(null, { data })

  write(typeof data === 'string' ? data : JSON.stringify(data))
}
