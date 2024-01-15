import chalk from 'chalk'

import dye from './dye.js'
import write from './write.js'
import dir from './call/dir.js'
import table from './call/table.js'
import group from './call/group.js'
import error from './call/error.js'
import { polyfillConsole } from './utils.js'

polyfillConsole()

const log = (...messages: string[]) => {
  console.log(messages.join(''))

  log.write(messages.join(''))
}

log.group = group

log.table = table

log.dir = dir

log.error = error

// 文本染色
log.dye = dye

// 将 y-tlog.log 写入本地磁盘的配置; 默认情况不写
log.writeConfig = write.config

log.write = write

// hex
log.hex = chalk.hex

// rgb
log.rgb = chalk.rgb

export default log
