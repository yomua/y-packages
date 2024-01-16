import { useEffect } from 'react'
import { debounce } from '@yomua/y-screw'

export interface Options {
  delay?: number // 单位: 毫秒
  isRefreshItself?: boolean
}

const DEFAULT_OPTIONS = {
  delay: 0,
}

// 此 hook 的监听器将被防抖
export default function useWindowEventListener(
  eventName: string,
  listenCallback: EventListenerOrEventListenerObject,
  effect?: React.DependencyList,
  options: Options = DEFAULT_OPTIONS,
) {
  if (!eventName) {
    return
  }

  const { delay = 0, isRefreshItself = false } = options

  useEffect(() => {
    window.addEventListener(
      eventName,
      debounce(listenCallback, delay, { isRefreshItself }),
    )

    return () => {
      window.removeEventListener(
        eventName,
        debounce(listenCallback, delay, { isRefreshItself }),
      )
    }
  }, effect)
}
