import fs from 'fs'
import path from 'path'

import { DEFAULT_WRITE_CONFIG } from './constants.js'

// 将数据追加到已有内容之前
const appendFileToFront = function (data: string) {
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

const write = function (data: string) {
  if (!write.config.isWrite) {
    return
  }

  // 格式化为字符串
  data = typeof data === 'string' ? data + '\n' : JSON.stringify(data) + '\n'

  // 设置日期
  data = `[${new Date().toLocaleString()}] ${data}`

  appendFileToFront(data)
}

// 默认情况不写
write.config = DEFAULT_WRITE_CONFIG

export default write
