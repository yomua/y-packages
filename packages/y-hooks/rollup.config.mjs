import extendedConfig from '../../base.rollup.config.lib.mjs'

export default extendedConfig({
  esmOutput: {
    dir: 'dist',
    format: 'es',
    preserveModules: true, // 保留模块结构
    preserveModulesRoot: 'src',
  },
  externalL: ['react', '@yomua/y-screw'],
})
