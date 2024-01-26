/** 将 timer 写在外面的好处:
 * 当 debounce 被反复刷新时，仍可以保证 fn 能被防抖
 * 即：如果 debounce 函数写在 React 组件内部，当 React 组件刷新时，可能会重新执行 debounce 函数，
 * 此时如果没有做 [防止重复刷新] 操作，则 fn 将不会被防抖，因为此时相当于重新创建了一个作用域，生成了新的 setTimeout 和新的 fn,
 * 它们和之前的 setTimeout, fn 没有关联。
 */
let preventRefreshItselfTimer: NodeJS.Timeout

export default <T = () => void>(
    fn: T,
    delay: number,
    option?: {
        isRefreshItself?: boolean
    },
) => {
    const { isRefreshItself = false } = option ?? {}

    let timer: NodeJS.Timeout

    function preventRefreshItself(...rest) {
        if (preventRefreshItselfTimer) {
            clearTimeout(preventRefreshItselfTimer)
        }

        preventRefreshItselfTimer = setTimeout(() => {
            if (typeof fn === 'function') {
                // 使用 fn 作为 this
                fn.apply(fn, rest)
            }
        }, delay)
    }

    if (isRefreshItself) {
        return preventRefreshItself
    }

    return function (...rest) {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            if (typeof fn === 'function') {
                fn.apply(fn, rest)
            }
        }, delay)
    }
}
