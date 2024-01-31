# 描述

简单的断言库

# 使用

## expect

```js
import assert from '@yomua/y-assert'

const { expect } = assert

expect('yomua').equal('yomua') // true

expect('yomua').equal('yyy') // throw AssertError
```
