import { exec } from 'child_process'
import log from '@yomua/y-tlog'

import { deleteFolder } from '../utils/index.mjs'

// 由于 packages 下的很多包都先依赖 y-screw, 所以先对它进行 build
const buildBeforeCmd = ['yarn b:screw']
const buildBeforeDeleteFolder = ['y-screw/dist']

// 匹配错误文本
const errorTextReg = /error|failed/gi

function runCmd(command) {
  const childProcess = exec(command)

  childProcess.stdout.on('data', (data) => {
    log.success('子进程 > ')
    log(data)
  })

  childProcess.stderr.on('data', (data) => {
    if (errorTextReg.test(data)) {
      // Ref: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex
      // 重置匹配位置 (有全局匹配 g 或 y 标识的时候, 才会生效)
      errorTextReg.lastIndex = 0
      log.error('子进程错误 > ', data)
    }
  })

  childProcess.on('exit', (code) => {
    if (code === 0) {
      log.success(`SUCCESS: ${command}`)
    } else {
      log.error(`FAILED ${command}`)
    }
  })
}

/**
 * 再执行 yarn build 之前会执行的函数
 * @param {string[]} commands 需要执行的包含命令得数组
 */
function buildBefore(commands) {
  // 删除指定文件夹
  deleteFolder(buildBeforeDeleteFolder)

  for (const i in commands) {
    const cmd = commands[i]

    runCmd(cmd)
  }
}

buildBefore(buildBeforeCmd)
