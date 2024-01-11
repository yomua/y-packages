import { hashString } from './utils/index.js'
import type { Request, Response } from './index.d'

// 全局存储
class Store {
  static instance: Store
  private routerMap = {}
  private corsMap = {}

  static get singleInstance() {
    if (!this.instance) {
      this.instance = new Store()
    }

    return this.instance
  }

  // 暂存 listener - path 的 onListener, 以便后续使用
  savePath(path: string, onListener: (req: Request, res: Response) => void) {
    this.routerMap[path] = onListener
  }

  // 暂存 cors - onCors, 以便后续使用
  saveCors(onCors: (req: Request, res: Response) => void) {
    this.corsMap[hashString(onCors.toString())] = onCors
  }

  get router() {
    return this.routerMap
  }

  get cors() {
    return this.corsMap
  }
}

export default Store.singleInstance
