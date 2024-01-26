export default function (
  obj: Object & { __flags?: { [key: string]: any } },
  key: string | symbol | number,
  value?: any,
) {
  const flags = obj.__flags || (obj.__flags = Object.create(null))

  // 为什么不用 if(value);
  // 因为这里我想要的是: 当传入第 3 个参数 (value) 时, 始终使用 value 值重设 flags[key] 的值
  // 无论 value 的值是什么, 可能是: undefined, null, 0, '', false 等
  if (arguments.length === 3) {
    flags[key] = value
    return
  }

  return flags[key]
}
