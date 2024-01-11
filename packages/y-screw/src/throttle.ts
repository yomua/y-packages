export default <T = () => void>(fn: T, delay: number) => {
    let timer: NodeJS.Timeout

    return function (...rest) {
        if (timer) {
            return
        }

        timer = setTimeout(() => {
            if (typeof fn === 'function') {
                fn.apply(this, rest)
            }

            timer = null as any
        }, delay)
    }
}
