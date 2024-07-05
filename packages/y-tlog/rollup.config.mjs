import { nodeResolve } from '@rollup/plugin-node-resolve'

import extendedConfig from '../../base.rollup.config.mjs'

// chalk 库会使用  navigator 做一些判断, 导致当你在非浏览器环境使用 chalk 或一些特殊情况下, 会致使你的服务崩溃.
// yomua 仓库 使用 yarn build-article 时, 就会出现这种情况.
// 所以这里配置 intro: 让 rollup 打包时将这字符串作为声明提到打包后的代码最前面.
// Ref: https://cn.rollupjs.org/configuration-options/#output-intro-output-outro
const intro = `try {
  if (!navigator) {
    var navigator = { userAgentData: null }
  }
} catch (error) {
  var navigator = { userAgentData: null }
}`

// 将 chalk 模块内置到项目中
// => why? chalk 不支持 cjs, 会导致一些环境上的问题.
// => 如: github pages 进行托管, 发布时, 可能会导致发布失败, 提示错误: chalk 为 ESModule, 不允许在 commonjs 中使用
// 或许在本地开发时不会有问题, 但是这仍然是一个隐患, 所以经过权衡, 仍然选择将 chalk 内置到项目内.
export default extendedConfig({
  plugins: [
    nodeResolve({
      resolveOnly: ['chalk', '#ansi-styles', '#supports-color'],
    }),
  ],
  output: {
    es: {
      intro,
    },
    cjs: {
      intro,
    },
  },
  controlConfig: {
    cjs: true,
  },
  defaultDtsExternal: ['chalk', 'http'],
})
