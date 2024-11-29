# 描述

用于终端或浏览器打印彩色日志并记录

# 示例

## 基本使用

```js
import log from '@yomua/t-log'

/**
 * 打印: 
    1 2 3 4 5
 * 日志记录: 
    [2024/1/22 13:52:45] [INFO] 1 2 3 4 5
 */
log(1, 2, 3, 4, 5)

/**
 * 打印: 
    { name: 'yomua' } [ 1, 2 ]
 * 日志记录: 
    [2024/1/26 17:47:05] [INFO] {"name":"yomua"} 1 2
 */
log({ name: 'yomua' }, [1, 2])

/**
 * 打印: 
    Parent
      parent_message
      son
        son_message
        grandSon
          grandSon_message
 * 日志记录: 
    [2024/1/22 11:43:31] [GROUP] Parent
      "parent_message"
    [2024/1/22 11:43:31] [GROUP] son
      "son_message"
    [2024/1/22 11:43:31] [GROUP] grandSon
      "grandSon_message"
 */
log.group('Parent', [
  {
    message: 'parent_message',
    type: 'error',
  },
  {
    message: {
      title: 'son',
      sub: [
        { message: 'son_message' },
        {
          message: {
            title: 'grandSon',
            sub: [{ message: 'grandSon_message' }],
          },
          type: 'group',
        },
      ],
    },
    type: 'group',
  },
])

/**
 * 打印: 
  ┌─────────┬─────────┬──────┐
  │ (index) │  name   │ age  │
  ├─────────┼─────────┼──────┤
  │    0    │ 'yomua' │ '18' │
  └─────────┴─────────┴──────┘
 * 日志记录:
    [2024/1/22 14:21:43] [TABLE] {"name":"yomua","age":"18"}
 */
log.table([{ name: 'yomua', age: '18' }])

/**
 * 打印: 
    [ { name: 'yomua' } ]
 * 日志记录: 
    [2024/1/22 14:22:33] [DIR] [{"name":"yomua"}]
 */
log.dir([{ name: 'yomua' }])

/**
 * 打印: 
    error
 * 日志记录: 
    [2024/1/24 16:52:59] [ERROR] error
 */
log.error('error')

/**
 * 打印: 
    success
 * 日志记录: 
    [2024/1/24 16:52:59] [SUCCESS] success
 */
log.success('success')

/**
 * 打印: 
    warn1 warn2
 * 日志记录: 
    [2024/1/22 14:22:33] [WARN]
      warn1
      warn2
 */
log.warn('warn1', 'warn2')
```

## 染色

```js
import log from '@yomua/t-log'

const { dye } = log
dye.info('yomua', 'To') // yomuaTo (白色)
dye.success('yomua', 'To') // yomuaTo (绿色)
dye.error('yomua', 'To') // yomuaTo (红色)
dye.warning('yomua', 'To') // yomuaTo (黄色)

// 16 进制
log(dye.hex('#ffffff')('yomua')) // yomua (白色)
log(dye.bgHex('#fff')('yomua')) // yomua (背景白色)

// rgb 色彩
log(dye.rgb(255, 0, 0)('yomua')) // yomua (红色)
log(dye.bgRgb(255, 0, 0)('yomua')) // yomua (背景红色)
```

## 风格

```js
import log from '@yomua/t-log'

const { style } = log
log(style.bold('yomua')) // yomua (加粗)
log(style.italic('yomua')) // yomua (斜体)

//... 更多风格参见 style 类型导出
```

## 写入磁盘

只有在 node 环境下才有用, 对于 browser 环境, 是无效的, 什么都不会发生.

```js
import log from '@yomua/t-log'

// 必须: 启用 write - 默认 false
log.writeConfig.isWrite = true //

// 可选: 写入的路径 - 默认 ./
log.writeConfig.filePath = './'

// 可选: 写入的文件名 - 默认 y-tlog
log.writeConfig.filename = 'y-tlog'

// 可选: 写入的文件后缀 - 默认 log
log.writeConfig.fileSuffix = 'log'

// 任何一个 log 都会将数据写入本地, 默认以时间降序
log('yomua')
log.group('title', [{ message: 'yomua' }])
log.dir([{ name: 'yomua' }])
```

## 发送请求

node 环境使用 [http.request()](https://nodejs.cn/api/v18/http.html#httprequesturl-options-callback)

browser 环境使用 [fetch()](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

```js
import log from '@yomua/t-log'

// 必须: 启用请求
log.requestConfig.isRequest = true

// 必须: 配置服务地址 - 默认 ''
log.requestConfig.url = 'http://localhost:4000/test'

// 可选: http.RequestOptions  - 默认 undefined
log.requestConfig.options = {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
  },
}

// 可选: 错误回调  - 默认 () => null
log.requestConfig.onError = (error) => {}

// 可选: 成功回调  - 默认 () => null
// 如果是 node 环境, 且是流式传输响应数据: 则可以通过 onReceiver 返回的数据来决定 data
log.requestConfig.onSuccess = (data) => {
  // 回调函数中不允许再次调用 log, 否则会造成无限循环 -> 因为每次 log 都会发送请求, 同时再触发 onSuccess;
  // 如果一定要怎么做, 可以添加以下行:
  // log.requestConfig.isRequest = false
  // => 设置成不允许请求, 就不会继续发送请求
  console.dir(data)
}

// 可选: 数据传输时回调 - 只在 node 环境生效  - 默认 () => null
// 当服务端实现流式传输, 则此回调也将在每传输一次数据时就调用
// 返回的内容将存入一个数组, 最后发送给 onSuccess 的参数 data
log.requestConfig.onReceiver = (chunk) => {
  return '_onReceiver' + chunk
}

// 任何一个 log 都将发送请求
log('yomua')
log.group('title', [{ message: 'yomua' }])
log.dir([{ name: 'yomua' }])
```

对于发送请求操作, 携带的数据为由 log 时决定, 即: log 时使用什么数据, 就发送什么数据.

不同环境下发送数据的类型格式不同:

- 在浏览器环境, 数据通过 body 发送, 类型由 log 决定: log() 什么类型, 就发送什么类型

- 在 node 环境, 携带的数据为 JSON 字符串, 不是字符串的将通过 JSON.stringify() 转换

特殊情况: 当传入多个参数给 log 时, 会将这些参数组装成一个数组发送.

```js
// 发送 [1, 2, 3, 4]
log(1, 2, 3, 4)

// 发送 {name: 'yomua'}
log.dir({ name: 'yomua' })
```

# chalk?

你知道的, 较新版本的 [chalk](https://www.npmjs.com/package/chalk) (5.3.0) 目前是不支持 CommonJS 的, 所以如果对于有使用到 CommonJS 的项目来说, chalk 使用起来并不方便.

@yomua/y-tlog 已将 chalk 内置, 并且可使用 `log.chalk` 逃生到 chalk, 同时也支持 CommonJS.

# FAQ

## log.group 时多次发送请求

是的, 目前 log.group 实现会进行递归, 每次递归都会发送请求

## 无限循环发送请求

检查 onSuccess, onError, onReceiver 中是否继续调用了 log;

如果是, 请删除;

或者使用:

```js
log.requestConfig.onSuccess = (data) => {
  log.requestConfig.isRequest = false
  log.dir(data)
}
```
