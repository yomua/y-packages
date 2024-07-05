import extendedConfig from '../../base.rollup.config.mjs'

export default extendedConfig({
  // crypto 属于 node 内置模块, 不需要打包进去
  external: ['crypto', 'fs'],
  controlConfig: {
    cjs: true,
  },
})
