// 此文件用来解析 lib 中的 import 语句
// import useURL from './useURL' => import useURL from './useURL/index.js'
// import test from './test => import test from './test.js'
// => 1. 会尝试对每一个导入语句拼接 '/index.js', 如果拼接后的路径非文件, 则继续下一个规则
// => 2. 会尝试对每一个导入语句拼接 '.js', 如果拼接后的路径非文件, 则继续下一个规则
// => 目前只有这两个规则
// 注: lib 文件夹中的文件是经过 tsc 编译 ts 后所形成的 js 文件.
// 且目前 resolveImport 只用在 y-hooks 项目, 此项目由 tsc 编译, 且保持了目录和文件结构, 所以需要解析 import 语句
// => 因为由 tsc 编译只会将 ts 翻译成 js, 并不会更改任何导入语句.

const fs = require('fs')
const path = require('path')
const fsPromises = require('fs').promises
const log = require('@yomua/y-tlog')
const { isType } = require('@yomua/y-screw')

const Chain = require('../utils/chain.cjs')

const chain = new Chain()

const [nodeExePath, currentFilePath, libPath] = process.argv

const appendSuffix1 = '/index.js'
const appendSuffix2 = '.js'

// 匹配导入, 导出语句 - 相对路径
// => 匹配: import a from '../a'
// => 匹配: import a from './a'
// => 不匹配: import a from '@/a'
// => 不匹配: import a from 'a'
const regexpNames =
  /(?:export|import)(?:\s)*?(?:\{)??.*?(?:\})??(?:\s)*?from(?:\s)*?["']([.]{1,2}\/.+)["']/gm

// 匹配导入, 导出声明 - 相对路径
// => 匹配: import a from '../a.d'
// => 匹配: import a from './a.d'
// => 不匹配: import a from '@/a.d'
// => 不匹配: import a from 'a.d'
const regexpTypes =
  /(?:export|import)(?:\s)*?(?:\{)??.*?(?:\})??(?:\s)*?from(?:\s)*?["']([.]{1,2}\/.+\.d{1})["']/gm

/**
 *
 * @param {string} filePath 文件路径
 * @param {string} connectPath 如果传入目录路径, 则 ${connectPath}/目录下的文件名
 * @returns {Promise<{message: string} | string[]>} 指示是否委托给下一个函数 或 返回拼接 ${connectPath}/目录下文件名 的字符串数组
 */
async function handleDir(filePath, connectPath) {
  // log.success('目录处理: ', filePath)
  // 得到文件或目录信息
  const statInfo = await fsPromises.stat(filePath)

  // 如果是目录: 取出所有子节点, 再压入栈 dirs, 并返回 dirs.
  if (statInfo.isDirectory()) {
    const dirs = await fsPromises.readdir(filePath)

    const result = []

    if (dirs) {
      for (const dir of dirs) {
        result.push(path.join(connectPath, dir))
      }
    }

    return result
  }

  // 如果非目录, 则直接返回 next
  return { message: 'next' }
}

/**
 *
 * @param {string} filePath
 * @returns {Promise<string>} 文件内容
 */
async function handleFile(filePath) {
  // log.success('文件处理: ', filePath)

  let fileContent = await fsPromises.readFile(filePath, {
    encoding: 'utf8',
  })

  const matchAll = fileContent.matchAll(regexpNames)

  let count = 0

  for (const item of matchAll) {
    // 已经有 .js 后缀, 或有 .d 后缀
    if (/.js$/.test(item[1]) || /.d$/.test(item[1])) {
      continue
    }
    const replacedStr = item[0] // 被替换的字符串

    let resultStr = ''

    const index = item.index + count

    let isFileConnectIndexJS = false

    // 尝试对每一个需要拼接的导入语句认为是文件夹, 拼接 /index.js,
    // 如果拼接后的路径是存在的, 则拼接 /index.js, 否则拼接 .js
    try {
      isFileConnectIndexJS = fs
        .statSync(path.resolve(filePath, '../', item[1] + appendSuffix1))
        .isFile()
    } catch (error) {
      isFileConnectIndexJS = false
    }

    if (isFileConnectIndexJS) {
      resultStr = replacedStr.replace(item[1], `${item[1]}${appendSuffix1}`)
    } else {
      resultStr = replacedStr.replace(item[1], `${item[1]}${appendSuffix2}`) // 替换的字符串; 用来替换被替换的字符串
    }
    const past = fileContent.slice(0, index) // 之前的导入语句内容
    const feature = fileContent.slice(
      index + replacedStr.length,
      fileContent.length,
    )
    fileContent = `${past}${resultStr}${feature}`
    if (isFileConnectIndexJS) {
      count = count + appendSuffix1.length
    } else {
      count = count + appendSuffix2.length
    }
  }

  return fileContent
}

async function start() {
  try {
    const readDir = path.resolve(__dirname, '../packages', libPath)
    log.success('当前解析文件路径: ', readDir)
    // 得到 readDir 下所有目录路径和文件路径, 以 readDir 作为根路径, 得到的数据中不会包含它.
    // => 如: readDir 下存在: index.js(文件), useURL(文件夹), useLockEffect(文件夹)
    // => 则会返回: ['index.js', 'useURL', 'useLockEffect']
    const dirs = await fsPromises.readdir(readDir)

    // 以栈的形式进行 dfs
    // => 每取到一个节点 A, 就会把节点 A 的所有子节点全部取出来继续压入栈的最后面 (数组最后面),
    // => 然后再从栈的最后面取出节点 (如果 A 是目录, 那么这次取出的节点就是 A 的子节点)
    // => 如此反复, 直到所有文件夹的文件被取完并压入栈, 且栈中的所有文件处理完成.
    while (dirs.length) {
      // 如: index.js
      const popPath = dirs.pop()

      // 此文件的绝对路径
      // => ${readDir}/index.js
      // => 如: D:\code\y-packages\packages\y-hooks\lib\index.js
      const filePath = path.resolve(readDir, popPath)

      // 根据 filePath 是文件夹, 还是文件, 进行不同的处理
      chain.setReceiver(handleDir, filePath, popPath)
      chain.setReceiver(handleFile, filePath)

      const [dirResult, fileResult] = await chain.passRequest()

      // next: 表示当前处理的 filePath 不是文件夹, 而是文件.
      const isNext = dirResult?.message === 'next'

      // 如果是文件夹, 则将此文件夹下的所有一级文件全部压入栈
      // 如: test/test1.js, test/test2.js, test/re, 则 ['test1.js', 'test2.js', 're']
      if (!isNext && isType(dirResult, 'array')) {
        dirs.push(...dirResult)
      }

      // 若是文件, 则将文件内容写入到文件路径 filePath
      if (isNext) {
        await fsPromises.writeFile(filePath, fileResult, { encoding: 'utf8' })
      }
    }
  } catch (error) {
    log.error(`解析失败: ${path.resolve(__dirname, '../packages', libPath)}`)
    log.error(error)
  }
}

start()
