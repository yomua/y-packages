import extendedConfig from '../../base.rollup.config.mjs'

export default extendedConfig({
  external: ['@yomua/y-screw', '@yomua/y-tlog'],
  controlConfig: {
    cjs: true,
  },
})
