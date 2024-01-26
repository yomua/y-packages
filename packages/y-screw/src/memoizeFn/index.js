"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
function hashString(inputString) {
    var hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}
// 只能在全局或某个持久上下文声明 cache
// 不能 fn.cache = fn.cache || new Map()
// 这是因为: 声明一个 fn, 然后在不同模块 memo(fn), 每一个 fn 虽然引用一个 fn, 但每个 fn 指向的内存地址不同, 即: 它们并不会是同一个.
// =>模块的实现原理是类似闭包的原理, 模块和模块之间是将会有不同的作用域;
// => Ref: https://www.webpackjs.com/concepts/modules/ ; https://juejin.cn/post/6844904159385239566#heading-7
// 另外一个例子: 在 React 组件中使用 memoizeFn(fn), 当组件刷新时, fn 是指向不同的内存地址空间的
// => 这是由于组件相当于一个函数, 它被重新执行了一遍, 里面的未被缓存状态就会刷新.
// => 所以现在如果将 cache 挂载到 fn 上, 由于永远会返回新的 fn, 所以 memo 就没效果.
var cache = new Map();
function memoizeFn(fn, options) {
    if (typeof fn !== 'function') {
        throw new Error('memoizeFn expects got a function');
    }
    var _a = options !== null && options !== void 0 ? options : {}, resolver = _a.resolver, context = _a.context;
    if (context && !(context instanceof Map)) {
        throw new Error('context must be a Map Instance');
    }
    fn.cache = context !== null && context !== void 0 ? context : cache;
    var key = resolver || hashString(fn.toString());
    if (!fn.cache.has(key)) {
        fn.cache.set(key, fn);
    }
    return fn.cache.get(key);
}
exports.default = memoizeFn;
