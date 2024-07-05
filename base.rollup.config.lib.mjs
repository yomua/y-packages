import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'

export default function ({
  input = 'lib/index.js',
  dtsInput = 'lib/index.d.ts',
  esmOutput = {},
  cjsOutput = {},
  external = [],
  controlConfig = {
    cjs: false,
  },
}) {
  const { cjs = false } = controlConfig ?? {}

  return [
    {
      input,
      output: esmOutput,
      plugins: [
        del({
          targets: ['dist/*', 'tsconfig.tsbuildinfo'],
          verbose: true,
          hook: 'buildEnd',
        }),
      ],
      external,
    },
    cjs && {
      input,
      output: cjsOutput,
      external,
    },
    {
      input: dtsInput,
      output: [{ file: 'dist/index.d.ts', format: 'es' }],
      plugins: [dts()],
    },
  ].filter(Boolean)
}
