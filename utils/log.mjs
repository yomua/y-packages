/** 用于文件, 和 @yomua/y-tlog 用法一样
 * scripts/build.mjs; 因为此处用 log 来进行输出日志
 */

const flag = '\x1b'

function dye() {}

dye.error = function (...msg) {
  return `${flag}[31m${msg.join(' ')}${flag}[0m`
}

dye.success = function (...msg) {
  return `${flag}[32m${msg.join(' ')}${flag}[0m`
}

export function log(...msg) {
  console.log(...msg)
}

log.dye = dye

log.success = function (...msg) {
  console.log(`${flag}[42m${msg.join(' ')}${flag}[0m`)
}

log.error = function (...msg) {
  console.log(`${flag}[41m${msg.join(' ')}${flag}[0m`)
}

export default log
