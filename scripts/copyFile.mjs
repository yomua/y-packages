import fs from 'fs'
import path from 'path'
import log from '@yomua/y-tlog'

const [
  nodeExePath,
  currentFilePath,
  sourceFilePath,
  targetFolderPath, // 需要复制到的目标文件夹路径
  fileName = path.basename(sourceFilePath, '.js'), // 复制过去时的文件名
  fileSuffix = 'mjs', // 复制过去时的文件后缀
] = process.argv

// 构造目标文件路径
const targetFilePath = path.join(targetFolderPath, fileName)

const renameFileName = path.join(targetFolderPath, `${fileName}.${fileSuffix}`)

const { dye } = log

log.dir(dye.success('fff'))
console.log(dye.success('复制文件'), sourceFilePath, '到', targetFilePath)

// 复制文件
fs.copyFile(sourceFilePath, targetFilePath, (err) => {
  if (err) {
    log.error('Copy Error:', err)
    return
  }

  fs.rename(targetFilePath, renameFileName, (renameErr) => {
    if (renameErr) {
      log.error('Rename error:', renameErr)

      return
    }
  })
})
