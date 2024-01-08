import { terser } from "rollup-plugin-bundleutils";
import typescript from "@rollup/plugin-typescript";

const DEFAULT_PLUGINS = [
  terser(), // 编译后压缩代码, tree shaking 之类的.
  typescript({ // 编译 typescript
    compilerOptions: { lib: ["es5", "es6", "dom"], target: "es5" },
  }),
];

export default function (options) {
  const {
    plugins = [],
    input = "src/index.ts",
    outputFileName = "index.js",
  } = options || {};

  return [
    {
      input,
      output: {
        file: `dist/es/${outputFileName}`,
        format: "es",
      },
      plugins: [...DEFAULT_PLUGINS],
    },

    {
      input,
      output: {
        file: `dist/cjs/${outputFileName}`,
        format: "cjs",
      },
      plugins: [...DEFAULT_PLUGINS, ...plugins],
    },
  ];
}
