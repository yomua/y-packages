import http from 'http'

import store from '../store.js'
import { isEmptyObject } from '../utils/index.js'

export default function (port: number, onStart: (port: number) => void) {
  const server = http.createServer((req, res) => {
    if (!isEmptyObject(store.cors)) {
      for (const key in store.cors) {
        store.cors[key](req, res)
      }
    }

    for (const key in store.router) {
      if (req.url === key) {
        // 这里不 return, 这样执行完 onListener 后, 程序还会往下执行, 我还能做一些其他操作.
        store.router[key](req, res)
      }
    }
  })

  server.listen(port, () => onStart(port))
}
