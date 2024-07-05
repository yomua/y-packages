import { useEffect } from 'react'
import { debounce } from '@yomua/y-screw'

export interface Options {
  delay?: number // 单位: 毫秒
  capture?: boolean // 是否为捕获
  isRefreshItself?: boolean // true: 防止 React 重新渲染时, 防抖失效
  returnEffect?: () => void
}

const DEFAULT_OPTIONS: Options = {
  delay: 0,
  capture: false,
  isRefreshItself: false,
  returnEffect: () => {},
}

// 此 hook 的监听器将被防抖
export default function useWindowEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  listenCallback: (this: Document, ev: WindowEventMap[K]) => any,
  effect?: React.DependencyList,
  options: Options = DEFAULT_OPTIONS,
) {
  if (!eventName) {
    return
  }

  const {
    delay = 0,
    capture = false,
    isRefreshItself = false,
    returnEffect = () => {},
  } = options

  useEffect(() => {
    const debounceCallback = debounce(listenCallback, delay, {
      isRefreshItself,
    })

    window.addEventListener(eventName, debounceCallback, capture)

    return () => {
      window.removeEventListener(eventName, debounceCallback, capture)

      returnEffect && returnEffect()
    }
  }, effect)
}
