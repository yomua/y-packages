// 更新页面 URL 地址, 并在需要时触发 'popstate' 事件。
export default function (
    url: string,
    options?: {
        state?: any // 当使用者监听 popstate 时，要传给 event.state 的数据
        go?: boolean // 修改 url 时是否直接跳转过去
    },
) {
    const { go = false, state = null } = options ?? {}

    window.history.replaceState(null, '', url)

    if (go) {
        const popStateEvent = new PopStateEvent('popstate', { state })

        window.dispatchEvent(popStateEvent)
    }
}
