import isNil from './is-nil'

// => 分别调用 memoize(fn) 和 memoize(fn) 
// => 这二者返回的 memoized 不同, 挂载的 cache 不同, cache 是不会相互影响的.
export default function <Args, FnResult>(
    fn: (...args: Args[]) => FnResult,
    options?: {
        // 和 HTTP Cache-Control: max-age<seconds> 作用一样
        // 即: 最大缓存秒数, 比如: maxAge=10, 则缓存 10s, 10s 过后重新计算缓存
        maxAge?: number
    },
) {
    const { maxAge } = options || {}

    // NaN: 缓存永不过期; 因为任何一个数和 NaN 比较都是 false; 包括 NaN === NaN 为 false
    let expiresTime = isNil(maxAge) ? NaN : Date.now() + maxAge * 1000

    const memoized = (...args: Args[]) => {
        const endTime = Date.now()

        const key = args[0]

        // 缓存到期;
        if (maxAge === 0 || (!isNil(maxAge) && endTime > expiresTime)) {
            // 清除缓存
            memoized.cache.delete(key)

            // 重新设置过期时间; 让下一轮 memoized 继续使用缓存
            expiresTime = endTime + maxAge * 1000
        }

        if (memoized.cache.has(key)) {
            return memoized.cache.get(key)
        }

        const result = fn.apply(this, args)

        memoized.cache = memoized.cache.set(key, result)

        return result
    }

    // 每次调用 memoize, 将返回不同的 memoized, 它们各自挂载 cache
    // 所以对于不同次调用 memoize, 然后返回 memoized 来说, 由于 cache 不同, 所以 key 相同也不会相互影响.
    memoized.cache = new Map()

    return memoized
}
