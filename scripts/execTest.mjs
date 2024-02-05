// 读取指定目录下的 *.test.mjs | *.test.cjs | *.test.js 文件
// 然后使用 node 执行它们;
// 读取一个执行一个

import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

import log from '@yomua/y-tlog'

import { getArgv } from '../utils/index.mjs'
import { exit } from 'process'

const { dye } = log

/**
 * @filePath 测试文件所在目录
 * @breakException 当执行某个测试文件时, 若发生异常, 是否中断后续所有测试
 */
const {
  notTest,
  filePath,
  notTestMsg = '暂时没有测试用例',
  breakException = false,
} = getArgv(process.argv)

if (notTest) {
  log.warn(notTestMsg)
  exit(0) // 退出当前脚本执行
}

// 需要执行测试的文件的后缀名
const FILE_SUFFIX_REGEXP = /^.*\.test\.(mjs|cjs|js)$/

function findTestFiles(directory, files = []) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  entries.forEach((entry) => {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      findTestFiles(fullPath, files)

      return
    }

    if (entry.isFile() && FILE_SUFFIX_REGEXP.test(entry.name)) {
      files.push(fullPath)
    }
  })

  return files
}

// 所有需要被测试的文件
const testFiles = findTestFiles(filePath)

// 使用 node 执行每一个测试文件
testFiles.forEach((testFile) => {
  log(dye.success(`执行路径: ${testFile}`))

  const command = `node ${testFile}`

  const childProcess = exec(command)

  childProcess.stdout.on('data', (data) => {
    log(dye.success('子进程 > '))
    log(data)
  })

  childProcess.stderr.on('data', (data) => {
    const separator = data.split('\n')
    const errorIndex = separator?.findIndex(
      (d) =>
        d.includes('Error') && !d.includes('import') && !d.includes('export'),
    )
    const onlyIncludeStackError = separator.splice(errorIndex).join('\n')
    log(`${dye.error('子进程错误 > ')}${onlyIncludeStackError}`)
    breakException && process.exit(1) // 退出后续任务 (不执行后续命令)
  })

  childProcess.on('exit', (code) => {
    if (code === 0) {
      log.success(`SUCCESS: ${testFile}`)
    } else {
      log.error(`FAILED ${testFile}`)
    }
  })
})
