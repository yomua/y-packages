# 描述

提供轻便好用的 JavaScript 功能的库.

# 环境

除了依赖浏览器环境的包, 其余都是浏览器或 node 环境下都可使用.

## 依赖浏览器环境 API

- `urlChange`

# node + browser 环境

## addBigNumbers

```js
import assert from '@yomua/y-assert'
import { addBigNumbers } from '@yomua/y-screw'

const { expect } = assert

const v1 = '11111111111.11111111111111111111111111111111111111111111111'
const v2 = '22222222222.33333333333333333333333333333333333333333333333'
const v3 = '33333333333.44444444444444444444444444444444444444444444444'

expect(addBigNumbers(v1).add(v2).get()).equal(v3)
expect(addBigNumbers('123').get()).equal('123')
```

## debounce

```js
import { debounce } from '@yomua/y-screw'

// 延迟 0ms, 若当前使用 debounce 的上下文被刷新, 则会生成新的计时器
// => 在 React 组件中使用 debounce, 若当前组件刷新, 则会执行 2 次回调函数.
debounce(() => {}, 0, { isRefreshItself: false })

// 延迟 1000ms, 若当前使用 debounce 的上下文被刷新, 则不会生成新的计时器
// => 在 React 组件中使用 debounce, 若当前组件刷新, 则只会执行 1 次回调函数.
// => 即: debounce 生成的 timer, 将拥有自己的上下文
debounce(() => {}, 1000, { isRefreshItself: true })
```

## getType

```js
import assert from '@yomua/y-assert'
import { getType } from '@yomua/y-screw'

const { expect } = assert

expect(getType([])).equal('array')
expect(getType({})).equal('object')

expect(getType(1)).equal('number')
expect(getType('yomua')).equal('string')
expect(getType(true)).equal('boolean')
expect(getType(Symbol(1))).equal('symbol')
expect(getType(null)).equal('null')
expect(getType(undefined)).equal('undefined')
expect(getType(BigInt(1))).equal('bigInt')

expect(getType(function () {})).equal('function')
```

## isEmptyObject

会校验对象中是否存在 Symbol 值.

```js
import assert from '@yomua/y-assert'
import { isEmptyObject } from '@yomua/y-screw'

const { expect } = assert

expect(isEmptyObject({})).equal(true)
expect(isEmptyObject({ a: 1 })).equal(false)
expect(
  isEmptyObject({
    [Symbol(1)]: 1,
  }),
).equal(false)
```

## isNil

```js
import assert from '@yomua/y-assert'
import { isNil } from '@yomua/y-screw'

const { expect } = assert

expect(isNil(null)).equal(true)
expect(isNil(undefined)).equal(true)
expect(isNil({})).equal(false)
```

## isType

```ts
import assert from '@yomua/y-assert'
import { isType } from '@yomua/y-screw'

const { expect } = assert

// 在 ts 中, 可以传入指定的类型, 从而约束传入数据的类型.
expect(isType<any[]>([], 'array')).equal(true)
expect(isType<object>({}, 'object')).equal(true)

expect(isType(1, 'number')).equal(true)
expect(isType('yomua', 'string')).equal(true)
expect(isType(true, 'boolean')).equal(true)
expect(isType(Symbol(1), 'symbol')).equal(true)
expect(isType(null, 'null')).equal(true)
expect(isType(undefined, 'undefined')).equal(true)
expect(isType(BigInt(1), 'bigInt')).equal(true)

expect(isType(function () {}, 'function')).equal(true)
```

## limitPromise

对一次性发送的请求次数进行限制.

术语称之为请求并发的限制.

简单来说: 当你限制一次性只能发送 2 个请求时, 若此时有 5 个请求要被发送, 则会先取前 2 个, 后 3 个则是放入一个数组进行等待, 当前面请求完成时, 再从数组中取出新请求, 再发送; 如此往复, 直到所有请求完成.

TIP: limitPromise 并不保证请求的顺序性, 即: 不保证先发出的请求先完成, 这取决于请求处理时间.

```js
import { limitPromise } from '@yomua/y-screw'

const limit = limitPromise(2)

function job(name) {
  console.log(`started: ${name}`)

  return new Promise((resolve, reject) => {
    // 当作异步任务
    setTimeout(
      () => {
        console.log(`    finished: ${name}`)
        resolve(name)
      },
      Math.floor(Math.random() * 1000),
    )
  })
}

for (let i = 0; i <= 4; i++) {
  limit(() => job(i))
}

// 输出
// started: 0
// started: 1
//   finished: 0
// started: 2
//  finished: 2
// started: 3
//  finished: 3
// started: 4
//  finished: 1
//  finished: 4
```

## memoizeFn

```js
import assert from '@yomua/y-assert'
import { memoizeFn } from '@yomua/y-screw'

const { expect } = assert

let i = 0
let j = 0

function increasing1() {
  return ++i // 先自增再作为值返回;
}

function increasing2() {
  return ++j // 先自增再作为值返回;
}

// memoizeFn 返回的函数指向的是你传进来的函数 increasing1
const memo1 = memoizeFn(increasing1, { resolver: '123' })
const memo2 = memoizeFn(increasing1, { resolver: '456' })

// 只对函数进行缓存, 不会对值进行缓存; 若想要对值进行缓存, Refer: memoizeFnValue
expect(memo1(1, 2, 3)).equal(1)
expect(memo1(1, 2, 3)).equal(2)

// 即使 key 不一样, 但是由于 memo 的是同一个函数, memoizeFn 返回函数就是这同一个函数, 所以返回 true
expect(memo1).equal(memo2)

// 由于 cache 是声明在全局内存中, 所以调用 memoizeFn 时, cache 都指向同一个
// 所以若有相同的 key, 则后面出现的一样的 key 将会被忽略
// 所以 memoizeFn 返回的函数将指向 cache.get(resolver) => 这里就是 increasing1
const memo3 = memoizeFn(increasing2, { resolver: '123' })
const memo4 = memoizeFn(increasing2, { resolver: '456' })

// memo3, memo4 是 increasing1, 不是 increasing2
// 所以不是使用 j 进行计算
expect(memo3()).equal(3)
expect(memo4()).equal(4)
```

## memoizeFnValue

```js
import assert from '@yomua/y-assert'
import { memoizeFnValue } from '@yomua/y-screw'

const { expect } = assert

let i = 0

function increasing() {
  i += 1

  return i
}

const increasing1 = memoizeFnValue(increasing)

// 连续调用 3 次, 仍然和第一次计算的值
expect(increasing1()).equal(1)
expect(increasing1()).equal(1)
expect(increasing1()).equal(1)

// 具有有效期, 且为 0s
const increasing2 = memoizeFnValue(increasing, { maxAge: 0 })
expect(increasing2()).equal(2)
expect(increasing2()).equal(3)
expect(increasing2()).equal(4)

// 具有有效期, 且为 1s
;(async function () {
  const increasing3 = memoizeFnValue(increasing, { maxAge: 1 })
  expect(increasing3()).equal(5) // 得到新值后, 缓存函数值
  expect(increasing3()).equal(5) // 使用缓存值

  await new Promise((resolve) => {
    return setTimeout(() => {
      // 1秒后缓存到期, 重新计算函数值并缓存, 这里新值为: 6
      // TIP: 当缓存到期, 得到新值后, 又会重新以当前时间戳 + maxAge 计算缓存时间.
      expect(increasing3()).equal(6)
      resolve()
    }, 1000)
  })

  expect(increasing3()).equal(6) // 使用新缓存值: 6

  await new Promise((resolve) => {
    return setTimeout(() => {
      // 1秒后缓存又到期, 又重新计算函数值并缓存, 这里新值为: 7
      expect(increasing3()).equal(7)
      resolve()
    }, 1000)
  })

  expect(increasing3()).equal(7) // 在没有过期之前, 这里将一直会使用缓存值: 7
})()
```

## throttle

```js
import { throttle } from '@yomua/y-screw'

throttle(() => {
  console.log('throttled')
}, 1000)
```

## toJSON

和 JSON.stringify 类似, 但是特殊处理以下值:

- 将 undefined 视为 null

- 将 function 做 toString() 处理

- 将 symbol 做 toString() 处理

### 示例

以下示例的 `equal(value)` 就是最终 `toJSON(data)` 得到的数据

```js
import assert from '@yomua/y-assert'
import { toJSON } from '@yomua/y-screw'
const { expect } = assert
```

```js
// 原始值
expect(toJSON(1)).equal(1)
expect(toJSON(true)).equal(true)
```

```js
// Symbol (Symbol 在此处也是原始值, 不过在这里将它独立书写, 以便阅读)
expect(toJSON(symbol1)).equal('Symbol(1)')
expect(toJSON({ [symbol1]: '1' })).equal('{"Symbol(1)":"1"}')
expect(toJSON([{ [symbol1]: 1 }])).equal('[{"Symbol(1)":1}]')
```

```js
// undefined (所有 undefined, 最后都会被转为 null 显示)
expect(toJSON(undefined)).equal(null)
expect(toJSON()).equal(null)
expect(toJSON({ name: undefined })).equal('{"name":null}')
expect(toJSON([undefined])).equal('[null]')
expect(toJSON([[undefined]])).equal('[[null]]')
expect(toJSON([{ name: undefined }])).equal('[{"name":null}]')
```

```js
// null
expect(toJSON(null)).equal(null)
expect(toJSON([null])).equal('[null]')
expect(toJSON({ name: null })).equal('{"name":null}')
expect(toJSON({ obj: { name: null } })).equal('{"obj":{"name":null}}')
```

```js
// 函数
expect(toJSON(function () {})).equal('function () {}')
expect(toJSON([function () {}])).equal('["function () {}"]')
```

```js
// 数组
expect(toJSON([1, 2, 3])).equal(JSON.stringify([1, 2, 3]))
expect(toJSON([null])).equal(JSON.stringify([null]))
expect(toJSON([undefined])).equal(JSON.stringify([undefined]))
expect(toJSON([null, undefined])).equal(JSON.stringify([null, undefined]))
expect(toJSON([[1, 2, 3]])).equal(JSON.stringify([[1, 2, 3]]))
expect(toJSON([{ name: 'yomua' }])).equal(JSON.stringify([{ name: 'yomua' }]))
expect(toJSON([{ obj: { name: 'yomua' } }])).equal(
  JSON.stringify([{ obj: { name: 'yomua' } }]),
)
```

```js
// 对象
// 将双引号改成单引号就会报错; 但是实际使用时没有问题
// 因为这里实际上会被转为字符串比较, 所以错一个字符都会报错, 这是正常的.
expect(toJSON({ name: 'yomua' })).equal(JSON.stringify({ name: 'yomua' }))
expect(toJSON({ obj: { age: '18' } })).equal(
  JSON.stringify({ obj: { age: '18' } }),
)
expect(toJSON({ arr: ['yomua'] })).equal(JSON.stringify({ arr: ['yomua'] }))
expect(toJSON({ arr: [{ name: 'yomua' }] })).equal(
  JSON.stringify({ arr: [{ name: 'yomua' }] }),
)
```

## conditionalChain

类似三元表达式, 但对多条件判断时, 语义更清晰

- 支持链式调用

- 对每个 `cond(condition)` 和 `r(result)` 实行位置上的一对一匹配

```js
import assert from '@yomua/y-assert'
import { conditionalChain } from '@yomua/y-screw'
const { expect } = assert

// 对字符串进行判断
expect(conditionalChain().cond('a').cond('b').cond('c').get()).equal(undefined)
expect(conditionalChain().cond('a').r('r1').get()).equal('r1')

// 对布尔值进行判断
expect(conditionalChain().cond(false).cond(true).r('r1').r('r2').get()).equal(
  'r2',
)

// 对表达式进行判断
expect(
  conditionalChain()
    .cond(1 === 0)
    .r('r1')
    .cond(1 === 1)
    .r('r2')
    .get(),
).equal('r2')

// 对函数表达式进行判断
expect(
  conditionalChain()
    .cond(() => true)
    .r('r1')
    .cond(() => false)
    .r('r2')
    .get(),
).equal('r1')

// 使用默认值
expect(
  conditionalChain()
    .default('default1')
    .cond(false)
    .default('default2')
    .r('r1')
    .get(),
).equal('default2')

expect(conditionalChain().cond(true).get()).equal(undefined)

// 条件全为 true, 则返回第一个 true 对应的值
expect(
  conditionalChain()
    .cond(true)
    .r('r1')
    .cond(true)
    .r('r2')
    .get(),
).equal('r1')
```

# browser 环境

## urlChange

```js
import { toJSON } from '@yomua/y-screw'

// 更改浏览器 url
urlChange(window.location.origin + '/yomua')

// 修改 url 时是否直接跳转过去
urlChange(window.location.origin + '/yomua', {
  go: true,
})
```

```js

// 携带 state
window.addEventListener('popstate', (event) => {
  console.log(event.state) // {name: 'yhw'}
})

// 当使用者监听 popstate 时，要传给 event.state 的数据
// TIP: 仅当 go: true 时才有用.
urlChange(window.location.origin + '/yomua', {
  state: { name: 'ywh' },
  go: true,
})
```
