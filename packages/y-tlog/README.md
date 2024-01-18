# 描述

用于终端或浏览器打印彩色日志并记录

# 示例

## 基本使用

```js
import log from '@yomua/t-log'

log(1, 2, 3, 4, 5) // 12345

/**
  Parent
    parent_message
    son
      son_message
      grandSon
        grandSon_message
 */
log.group('Parent', [
  {
    message: 'parent_message',
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
  ┌─────────┬─────────┬──────┐
  │ (index) │  name   │ age  │
  ├─────────┼─────────┼──────┤
  │    0    │ 'yomua' │ '18' │
  └─────────┴─────────┴──────┘
 */
log.table([{ name: 'yomua', age: '18' }])

// [ { name: 'yomua' } ] => Array
log.dir([{ name: 'yomua' }])

// 在终端表现和 log 一样: error
// 在浏览器端表现和 console.error 一样, 将会打印错误, 包含堆栈信息
log.error('error')
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
log(log.hex('#ffffff')('yomua')) // yomua (白色)

// rgb 色彩
log(log.rgb(255, 0, 0)('yomua')) // yomua (红色)
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
// 可以通过 onReceiver 返回的数据来决定 data
log.requestConfig.onSuccess = (data) => {
  // 回调函数中不允许再次调用 log, 否则会造成无限循环 -> 因为每次 log 都会发送请求, 同时再触发 onSuccess;
  // 如果一定要怎么做, 可以添加:
  // => log.requestConfig.isRequest = false
  // => 设置成不允许请求, 就不会继续发送请求
  console.dir(data)
}

// 可选: 数据传输时回调 - 针对 node  - 默认 () => null
// 当服务端实现流式传输, 则此回调也将在每传输一次数据时就调用
log.requestConfig.onReceiver = (chunk) => {
  return '_onReceiver' + chunk
}

// 任何一个 log 都将发送请求
log('yomua')
log.group('title', [{message:'yomua'}])
log.dir([{ name: 'yomua' }])

```

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
