import del from 'rollup-plugin-delete'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-bundleutils'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import defineDts from './base.rollup.config.dts.mjs'

const DEFAULT_PLUGINS = [
  del({ targets: 'dist/*', verbose: true, hook: 'buildEnd', runOnce: true }),
  json(),
  terser(), // 编译后压缩代码, tree shaking 之类的.
  typescript({
    // 编译 typescript
    compilerOptions: { lib: ['es5', 'es6', 'dom'], target: 'es6' },
    sourceMap: false,
  }),
  // nodeResolve(), // 如果一个包, 你需要内置到你写的包中(直接将源码写入项目), 则需要此插件解析;
]

export default function (options) {
  const {
    output,
    input = 'src/index.ts',
    plugins = [],
    external = [],
    dts = [],
    defaultDtsExternal = [],
    controlConfig = { cjs: false },
  } = options || {}

  const { cjs = false } = controlConfig ?? {}

  const {
    es: { file: esFile = 'dist/index.js', ...esRest },
    cjs: { file: cjsFile = 'dist/cjs/index.cjs', ...cjsRest },
  } = output ?? {
    es: {},
    cjs: {},
  }

  return [
    {
      input,
      output: {
        file: esFile,
        format: 'es',
        ...esRest,
      },
      plugins: [...DEFAULT_PLUGINS, ...plugins],
      external,
    },
    cjs && {
      // 在 node + ESModule 环境中, package.json 只会对 main 字段生效, 需要注意包中的额外包是否支持 cjs -> https://github.com/SunshowerC/blog/issues/8
      input,
      output: {
        file: cjsFile,
        format: 'cjs',
        ...cjsRest,
      },
      plugins: [...DEFAULT_PLUGINS, ...plugins],
      external,
    },

    ...defineDts({ dts, external: defaultDtsExternal }),
  ].filter(Boolean)
}
