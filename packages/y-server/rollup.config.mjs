import extendedConfig from '../../base.rollup.config.mjs'

export default extendedConfig({
  external: ['crypto', 'http', '@yomua/y-screw', 'os'],
})
