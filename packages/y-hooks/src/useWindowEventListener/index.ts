import { useEffect } from 'react'
import { debounce } from '@yomua/y-screw'

export interface Options {
  delay?: number // 单位: 毫秒
  isRefreshItself?: boolean
  returnEffect?: () => void
}

const DEFAULT_OPTIONS: Options = {
  delay: 0,
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
    isRefreshItself = false,
    returnEffect = () => {},
  } = options

  useEffect(() => {
    const debounceCallback = debounce(listenCallback, delay, {
      isRefreshItself,
    })

    window.addEventListener(eventName, debounceCallback)

    return () => {
      window.removeEventListener(eventName, debounceCallback)

      returnEffect && returnEffect()
    }
  }, effect)
}
