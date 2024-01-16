import * as crypto from 'crypto'
import * as os from 'os'

// 获取网络接口列表
const networkInterfaces = os.networkInterfaces()

export function hashString(inputString: string) {
  const hash = crypto.createHash('sha256')
  hash.update(inputString)
  return hash.digest('hex')
}

export const isEmptyObject = (obj: Record<string, any>) => {
  let isEmpty = true

  isEmpty = Object.keys(obj).length === 0

  if (Object.getOwnPropertySymbols(obj).length > 0) {
    isEmpty = false
  }

  return isEmpty
}

export function getIp() {
  const result = {}

  // 遍历网络接口列表，找到 IPv4 地址
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName] || []
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        result['ipv4'] = iface.address
      }
    }
  })

  return result as { ipv4: string }
}
