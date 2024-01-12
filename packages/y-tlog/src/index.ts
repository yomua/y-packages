import chalk from 'chalk'

import type { Log } from './index.d'

const CHALK_COLOR_MAP = {
  error: chalk.red,
  info: chalk.white,
  success: chalk.green,
}

const log: Log = (...messages: string[]) => {
  console.log(messages.join(''))
}

log.info = function (...messages: string[]) {
  const message = messages.join('')
  return CHALK_COLOR_MAP['info'](message)
}

log.error = function (...messages: string[]) {
  const message = messages.join('')
  return CHALK_COLOR_MAP['error'](message)
}

log.success = function (...messages: string[]) {
  const message = messages.join('')
  return CHALK_COLOR_MAP['success'](message)
}

export default log
