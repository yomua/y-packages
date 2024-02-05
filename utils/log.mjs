// 和 @yomua/y-tlog 用法一样
// 只不过在有些地方无法很好的导入 @yomua/y-tlog, 所以独立再写一份
// TIP: tlog 依赖了 screw, 但是 screw 没依赖 tlog
// => 如果形成循环依赖, 就会造成问题, build 不了了.
/** 用于文件
 * 还没有任何文件使用它
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
