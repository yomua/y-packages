// 为指定的实例创建 __flags 对象, 并挂载指定的 key, 设置指定的 value
// 若传入 value, 记录此值 -> __flags[key] = value
// 若未传入 value, 则直接返回 __flags[key]
export default function (
  obj: Object & { __flags?: { [key: string]: any } },
  // 不能将 key value 改成对象形式: {key, value }
  // 因为这里要使用 arguments.length 来防止 value 为 null, undefined 这些故意被重新设置的值.
  // 使第三个参数只要存在, 就会触发重新设置, 不论是 value, null, 0, '', false 等
  key: string | symbol | number,
  value?: any,
) {
  const flags = obj.__flags || (obj.__flags = Object.create(null))

  // 为什么不用 if(value);
  // 因为这里想要的是: 当传入第 3 个参数 (value) 时, 始终使用 value 值重设 flags[key] 的值
  // => 无论 value 的值是什么, 可能是: null, undefined, 0, '', false 等
  // 如果没有传入第 3 个参数, 则始终返回之前记忆的值
  if (arguments.length === 3) {
    flags[key] = value
    return
  }

  return flags[key]
}
