import fs from 'fs'
import path from 'path'
import log from '@yomua/y-tlog'

import { getArgv } from '../utils/index.mjs'

/**
 * @sourceFilePath 需要复制的文件
 * @targetFolderPath 需要复制到的文件夹
 * @fileName 复制过去后的文件名
 * @fileSuffix 复制后的文件后缀
 */
const {
  sourceFilePath,
  targetFolderPath,
  fileName = path.basename(sourceFilePath, '.js'),
  fileSuffix = 'mjs',
} = getArgv(process.argv)

const targetFilePath = path.join(targetFolderPath, `${fileName}.${fileSuffix}`)

const renameFileName = path.join(targetFolderPath, `${fileName}.${fileSuffix}`)

const { dye } = log

log(dye.success('复制文件'), sourceFilePath, '到', targetFilePath)

if (!fs.existsSync(targetFolderPath)) {
  fs.mkdirSync(targetFolderPath)
}

// 复制文件
fs.copyFile(sourceFilePath, targetFilePath, (err) => {
  if (err) {
    log.error('复制失败:', err)
    return
  }

  fs.rename(targetFilePath, renameFileName, (renameErr) => {
    if (renameErr) {
      log.error('重命名失败:', renameErr)

      return
    }
  })
})
