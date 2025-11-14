import isType from '../isType'

/**
 * 生成字符串的唯一哈希值
 * 支持 Node.js（ESM） / 现代浏览器 / 旧浏览器
 */

// 检测是否是 Node 环境
const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null

export default async function hashString(inputString: string): Promise<string> {
  if (
    !isType(inputString, 'string') ||
    isType(inputString, 'null') ||
    isType(inputString, 'undefined')
  ) {
    throw new Error('hashString expects got a string')
  }

  if (isNode) {
    const {
      default: { createHash },
    } = await import('crypto')
    const hash = createHash('sha256')
    hash.update(inputString)
    return hash.digest('hex')
  }

  // 浏览器环境（现代浏览器）使用 Web Crypto API
  try {
    if (
      typeof window !== 'undefined' &&
      window.crypto &&
      window.crypto.subtle
    ) {
      const encoder = new TextEncoder()
      const data = encoder.encode(inputString)
      const digest = await window.crypto.subtle.digest('SHA-256', data)
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    }
  } catch (error) {
    throw error
  }

  // 旧浏览器：使用纯 JS 实现的 SHA-256
  function sha256(ascii: string): string {
    function rightRotate(value: number, amount: number) {
      return (value >>> amount) | (value << (32 - amount))
    }
    const mathPow = Math.pow
    const maxWord = mathPow(2, 32)
    let result = ''

    const words: number[] = []
    const asciiBitLength = ascii.length * 8

    let hash: number[] = []
    const k: number[] = []
    let primeCounter = 0
    const isPrime = (n: number) => {
      for (let factor = 2, sqrtN = Math.sqrt(n); factor <= sqrtN; factor++) {
        if (n % factor === 0) return false
      }
      return true
    }
    const getFractionalBits = (n: number) => ((n - Math.floor(n)) * maxWord) | 0

    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (isPrime(candidate)) {
        if (primeCounter < 8)
          hash[primeCounter] = getFractionalBits(Math.pow(candidate, 1 / 2))
        k[primeCounter++] = getFractionalBits(Math.pow(candidate, 1 / 3))
      }
    }

    ascii += '\x80'
    while ((ascii.length % 64) - 56) ascii += '\x00'
    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i)
      if (j >> 8) return '' // ASCII check
      words[i >> 2] |= j << (((3 - i) % 4) * 8)
    }
    words[words.length] = (asciiBitLength / maxWord) | 0
    words[words.length] = asciiBitLength

    for (let j = 0; j < words.length; ) {
      const w = words.slice(j, (j += 16))
      const oldHash = hash.slice(0)

      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15],
          w2 = w[i - 2]

        const a = hash[0],
          e = hash[4]
        const temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0)
        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]))

        hash = [
          (temp1 + temp2) | 0,
          a,
          hash[1],
          hash[2],
          (hash[3] + temp1) | 0,
          hash[4],
          hash[5],
          hash[6],
        ]
      }

      for (let i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255
        result += (b < 16 ? 0 : '') + b.toString(16)
      }
    }
    return result
  }

  return sha256(inputString)
}
