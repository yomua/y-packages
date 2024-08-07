import { dts } from 'rollup-plugin-dts'

const DEFAULT_PLUGINS = [
  dts(), // 打包 dts 文件
]

export default function (options) {
  const {
    plugins = [],
    dts = [],
    input = 'src/index.d.ts',
    outputFileName = 'index.d.ts',
    external = [],
  } = options || {}

  return [
    {
      input,
      output: [
        {
          file: `dist/${outputFileName}`,
          format: 'es',
        },
      ],
      plugins: [...DEFAULT_PLUGINS, ...plugins],
      external,
    },
    ...dts,
  ]
}
