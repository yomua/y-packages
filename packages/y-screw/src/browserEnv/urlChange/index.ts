// 浏览器环境无法使用 fs, 如果暂时没有报错, 只不过你的打包器帮你 polyfill 了
import getMsg from '../../utils/getMsg'

// 更新页面 URL 地址, 并在需要时触发 'popstate' 事件。
export default function (
  url: string,
  options?: {
    state?: any // 当使用者监听 popstate 时，要传给 event.state 的数据
    go?: boolean // 修改 url 时是否直接跳转过去
  },
) {
  const { go = false, state = null } = options ?? {}

  try {
    window.history.replaceState(null, '', url)

    if (go) {
      const popStateEvent = new PopStateEvent('popstate', { state })

      window.dispatchEvent(popStateEvent)
    }
  } catch (error) {
    throw new Error(getMsg('screw.urlChange.env.error'))
    // throw new Error('"[urlChange]: 此函数仅在浏览器环境中可用。')
  }
}
