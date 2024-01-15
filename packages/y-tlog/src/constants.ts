import chalk from 'chalk'

export const CHALK_COLOR_MAP = {
  error: chalk.red,
  info: chalk.white,
  success: chalk.green,
  warning: chalk.yellow,
}

export const DEFAULT_WRITE_CONFIG = {
  isWrite: false,
  filePath: process.cwd(),
  filename: 'y-tlog',
  fileSuffix: 'log',
}
