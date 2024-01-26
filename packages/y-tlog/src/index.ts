import chalk from 'chalk'

import dye from './utils/dye'
import write from './utils/write'
import style from './utils/style'
import request from './utils/request'
import { polyfillConsole, transformToStrForLog } from './utils/index'
import dir from './call/dir'
import warn from './call/warn'
import table from './call/table'
import group from './call/group'
import error from './call/error'
import success from './call/success'

polyfillConsole()

const log = (...messages: any[]) => {
  console.log(...messages)

  request(null, { data: messages })

  write(transformToStrForLog(messages), {
    type: 'info',
  })
}

// 文本染色
log.dye = dye

// 风格
log.style = style

// 逃生到 chalk
log.chalk = chalk

// 直接调用便输出
log.group = group

log.table = table

log.dir = dir

log.error = error

log.success = success

log.warn = warn

// 主动写入数据到磁盘 - 由 log.writeConfig 配置
log.write = write

// 主动发送请求 - 由 log.requestConfig 配置
log.request = request

// 将 y-tlog.log 写入本地磁盘的配置; 默认情况不写
log.writeConfig = write.config

// 发送请求配置
log.requestConfig = request.config

export default log
