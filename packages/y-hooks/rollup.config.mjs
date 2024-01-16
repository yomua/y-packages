import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'

const input = 'lib/index.js'

const output = {
  dir: 'dist',
  format: 'es',
  preserveModules: true, // 保留模块结构
  preserveModulesRoot: 'src',
}
export default [
  {
    input,
    output,
    plugins: [
      del({
        targets: ['dist/*', 'tsconfig.tsbuildinfo'],
        verbose: true,
        hook: 'buildEnd',
      }),
    ],
    external: ['react', '@yomua/y-screw'],
  },
  {
    input,
    output,
    plugins: [dts()],
  },
]
