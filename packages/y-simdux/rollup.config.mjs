import extendedConfig from '../../base.rollup.config.lib.mjs'

export default extendedConfig({
  controlConfig: {
    cjs: true,
  },

  esmOutput: {
    file: 'dist/index.js',
    format: 'es',
  },
  cjsOutput: {
    file: 'dist/cjs/index.cjs',
    format: 'cjs',
  },
})
