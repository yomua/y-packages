import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-bundleutils'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import defineDts from './base.rollup.config.dts.mjs'

const DEFAULT_PLUGINS = [
  del({ targets: 'dist/*', verbose: true, hook: 'buildEnd' }),
  terser(), // 编译后压缩代码, tree shaking 之类的.
  // nodeResolve(), // 如果一个包, 你需要内置到你写的包中(直接将源码写入项目), 则需要此插件解析;
  typescript({
    // 编译 typescript
    compilerOptions: { lib: ['es5', 'es6', 'dom'], target: 'es5' },
  }),
]

export default function (options) {
  const {
    plugins = [],
    input = 'src/index.ts',
    outputFileName = 'index.js',
    cjs = false,
    external = [],
  } = options || {}

  return [
    {
      input,
      output: {
        file: `dist/${outputFileName}`,
        format: 'es',
      },
      plugins: [...DEFAULT_PLUGINS, ...plugins],
      external,
    },
    cjs && { // 在 node + ESModule 环境中, package.json 只会对 main 字段生效, 需要注意包中的额外包是否支持 cjs -> https://github.com/SunshowerC/blog/issues/8
      input,
      output: {
        file: `dist/cjs/${outputFileName}`,
        format: 'cjs',
      },
      plugins: [...DEFAULT_PLUGINS, ...plugins],
      external,
    },

    ...defineDts(),
  ].filter(Boolean)
}
