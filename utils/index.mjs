// 解析命令行参数
// ["--foo=f", "--bar=b"] => { foo: "f", bar: "b" }
export function getArgv(arr) {
  const result = {}

  arr.forEach((item) => {
    const [key, value] = item.split('=')
    result[key?.replace(/--/, '')] = value
  })

  return result
}
