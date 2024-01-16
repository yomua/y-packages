import type { Options } from '../useWindowEventListener'
import useWindowEventListener from '../useWindowEventListener'

// 更新页面当前显示的URL。
export default function useURL(
  // stateObj: Record<string, any> = {}, // replaceState.state; 暂时没用, 浏览器会忽略
  // title = '', // replaceState.title; 暂时没用, 浏览器会忽略
  url = '', // replaceState.url
  listener: (event: PopStateEvent) => void = () => void 0, // url 改变时是否触发 listener -> 当 options.go 为 true 时才会触发
  options?: {
    state?: any //  触发 listener 时, 传给 event.state 中的数据
    go?: boolean // 修改 url 时是否直接跳转过去
  } & Options,
) {
  const {
    go = false,
    state = null,
    delay = 0,
    isRefreshItself = false,
  } = options ?? {}

  window.history.replaceState(null, '', url)

  if (go) {
    const popStateEvent = new PopStateEvent('popstate', { state })
    window.dispatchEvent(popStateEvent)
  }

  useWindowEventListener('popstate', listener as any, [listener], {
    delay,
    isRefreshItself,
  })
}
