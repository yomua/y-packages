import * as http from 'http'

import store from '../store.js'
import { isEmptyObject } from '@yomua/y-screw'

export default function (port: number, onStart: (port: number) => void) {
  const server = http.createServer((req, res) => {
    // 配置 cors
    if (!isEmptyObject(store.cors)) {
      for (const key in store.cors) {
        store.cors[key](req, res) // 调用 cors 中存储的函数
      }
    }

    // 监听路由
    for (const key in store.router) {
      if (req.url === key) {
        // 这里不 return, 这样执行完 onListener 后, 程序还会往下执行, 还能做一些其他操作.
        store.router[key](req, res)
      }
    }
  })

  server.listen(port, () => onStart(port))
}
