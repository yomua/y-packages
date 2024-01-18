import chalk from 'chalk'

import { getEnv } from './index'

export const CHALK_COLOR_MAP = {
  error: chalk.red,
  info: chalk.white,
  success: chalk.green,
  warning: chalk.yellow,
}

export const IS_BROWSER = getEnv() === 'browser'
export const IS_NODE = getEnv() === 'node'
