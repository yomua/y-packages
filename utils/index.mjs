import fs from 'fs'
import path from 'path'

const cwd = process.cwd()

// 解析命令行参数
// ["--foo=f", "--bar=b"] => { foo: "f", bar: "b" }
// 注意: 返回的结果都是 string 类型的.
export function getArgv(arr) {
  const result = {}

  arr.forEach((item) => {
    const [key, value] = item.split('=')
    result[key?.replace(/--/, '')] = value
  })

  return result
}

/**
 *
 * 此函数认为项目根目录为: process.cwd(), 即: 当前项目所在的绝对路径作为根目录, 如: D:/code/y-packages
 * @param {string[]} folder 文件路径
 */
export function deleteFolder(folder) {
  folder?.forEach((p) => {
    try {
      p = path.join(cwd, 'packages', p)
      fs.rmSync(p, { recursive: true })
    } catch (err) {
      console.error(`删除文件失败 ${p}: ${err.message}`)
    }
  })
}
