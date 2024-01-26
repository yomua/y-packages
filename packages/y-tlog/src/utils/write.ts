import * as fs from 'fs'
import * as path from 'path'

import { LogType, WriteConfig } from '../index.d'
import DEFAULT_CONFIG from '../../defaultConfig.json'

import { IS_NODE } from './constants'
import { transformToStrForLog } from './index'

// 将数据追加到已有内容之前
const appendFileToFront = function (data: string) {
  // 从 write.config 取, 这样每次输出都可以根据配置决定操作
  const { filePath, filename, fileSuffix } = write.config

  const completePath = path.join(filePath, `${filename}.${fileSuffix}`)

  let currentContent = ''

  // 若已有内容, 则读取
  if (fs.existsSync(completePath)) {
    currentContent = fs.readFileSync(completePath, 'utf-8')
  }

  // 将新文本插入到已有内容前面
  const updatedContent = data + currentContent

  // 重写数据文件
  fs.writeFileSync(completePath, updatedContent)
}

const write = function (
  data: string,
  config: {
    type: LogType
  },
) {
  // 只允许启用了配置, 且环境为 node
  if (!write.config.isWrite || !IS_NODE) {
    return
  }

  const { type = 'info' } = config ?? {}

  // 格式化为字符串
  data = transformToStrForLog(data) + '\n'

  // 设置日期和类型
  data = `[${new Date().toLocaleString()}] [${type.toUpperCase()}] ${data}`

  appendFileToFront(data)
}

write.config = DEFAULT_CONFIG.write as WriteConfig

export default write
