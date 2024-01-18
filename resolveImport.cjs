// 此文件用来解析 lib 中的 import 语句
// import useURL from './useURL' => import useURL from './useURL/index.js'
// import test from './test => import test from './test.js'
// 注: lib 文件夹中的文件是经过 tsc 编译 ts 后所形成的 js 文件.

const fsPromises = require('fs').promises
const fs = require('fs')
const path = require('path')

const [nodeExePath, currentFilePath, libPath] = process.argv

const appendSuffix1 = '/index.js'
const appendSuffix2 = '.js'

void (async function () {
  try {
    const p = path.resolve(__dirname, 'packages', libPath)
    const paths = await fsPromises.readdir(p)
    // console.log(paths)
    const stack = [...paths]
    // console.log('__stack', stack)

    while (stack.length) {
      const top = stack.pop()
      const pat = path.resolve(p, top)
      const stat = await fsPromises.stat(pat)
      if (stat.isDirectory()) {
        const temp = await fsPromises.readdir(pat)
        if (temp) {
          for (const i of temp) {
            stack.push(path.join(top, i))
          }
        }
      } else {
        let personList = await fsPromises.readFile(pat, { encoding: 'utf8' })

        // 匹配导入, 导出语句 - 相对路径
        // => 匹配: import a from '../a'
        // => 匹配: import a from './a'
        // => 不匹配: import a from '@/a'
        // => 不匹配: import a from 'a'
        const regexpNames =
          /(?:export|import)(?:\s)*?(?:\{)??.*?(?:\})??(?:\s)*?from(?:\s)*?["']([.]{1,2}\/.+)["']/gm

        const match = personList.matchAll(regexpNames)
        let count = 0
        for (const item of match) {
          if (/.js$/.test(item[1])) {
            continue
          }
          // console.log('------------------start----------------')
          const rStr = item[0] // 被替换的字符串
          // console.log('_item', item)

          let replaceStr = ''

          const index = item.index + count

          let isFile = false
          // 尝试对每一个需要拼接的导入语句认为是文件夹, 拼接 /index.js,
          // 如果存在 index.js, 则拼接 /index.js, 否则拼接 .js
          try {
            isFile = fs
              .statSync(path.resolve(pat, '../', item[1] + appendSuffix1))
              .isFile()
          } catch (error) {
            isFile = false
          }

          if (isFile) {
            replaceStr = rStr.replace(item[1], `${item[1]}${appendSuffix1}`)
          } else {
            replaceStr = rStr.replace(item[1], `${item[1]}${appendSuffix2}`) // 替换的字符串; 用来替换被替换的字符串
          }
          const past = personList.slice(0, index) // 之前的导入语句内容
          const feature = personList.slice(
            index + rStr.length,
            personList.length,
          )
          personList = `${past}${replaceStr}${feature}`
          if (isFile) {
            count = count + appendSuffix1.length
          } else {
            count = count + appendSuffix2.length
          }

          // console.log('_past', past)
          // console.log('__rStr', rStr)
          // console.log('_replaceStr', replaceStr)
          // console.log('_feature', feature)
          // console.log('_personList', personList)
          // console.log('-----------------end-----------------')
        }

        await fsPromises.writeFile(pat, personList, { encoding: 'utf8' })
      }
    }
  } catch (error) {
    console.log(error)
  }
})()
