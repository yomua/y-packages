import type { default as Assert } from './index.d'
import expect from './expect'

const assert: typeof Assert = () => {}

assert.expect = expect

assert.locales = 'zh-CN'

export default assert
