// 读取指定目录下的 *.test.mjs | *.test.cjs | *.test.js 文件
// 然后使用 node 执行它们; 
// 读取一个执行一个

import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

import log from '@yomua/y-tlog'

const { dye } = log

const [nodeExePath, currentFilePath, filePath] = process.argv

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

const testFiles = findTestFiles(filePath)

testFiles.forEach((testFile) => {
  console.log(dye.success(`执行路径: ${testFile}`))

  const command = `node ${testFile}`

  const childProcess = exec(command)

  childProcess.stdout.on('data', (data) => {
    console.log(`${dye.success('子进程 > ')}${data}`)
  })

  childProcess.stderr.on('data', (data) => {
    console.error(`${dye.error('子进程错误 > ')}${data}`)
  })

  childProcess.on('close', (code) => {
    // console.log(`关闭子进程 ${code}`)
  })
})
