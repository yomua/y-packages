# module

## devDep

### 打包

- `rollup`

  打包关键库

- `rollup-plugin-bundleutils`

  对打包后的文件做一些优化: 比如 tree shaking, 代码压缩等.

- `rollup-plugin-delete`

  支持打包时删除指定文件

- `rollup-plugin-dts`

  汇总 .d.ts 文件的插件

- `@rollup/plugin-json`

  支持打包 json

- `@rollup/plugin-node-resolve`

  支持将依赖模块内置到项目中

- `@rollup/plugin-typescript`

  支持打包 typescript

  支持 .d.ts 打包.

  依赖 `tslib`

- tsc

  编译 ts 文件, 但只是类似于翻译 ts, 像别名这种就不会继续编译.

- [tsc-alias](https://www.npmjs.com/package/tsc-alias)

  支持 tsc 编译时的别名和转换成完整路径映射(resolveFullPaths)

  如: 在 tsconfig.json 中配置了路径别名 (比如 @src 指向 ./src), 和 resolveFullPaths

  ```ts
  {
    "compilerOptions": {
      "baseUrl": "./",
      "paths": {
        "@src/*": [".src/*"]
      }
    },
    "tsc-alias": {
      // 将导入的路径解析为完整的别名, 默认为 false
      // 其效果和 resolveImport.cjs 类似, 但是考虑的边界情况和扩展更多
      "resolveFullPaths": true
    }
  }
  ```

  `tsc-alias` - resolveFullPaths 会让编译后文件的导入路径正确映射到实际的文件结构。

  可以将 `tsc` 和 `tsc-alias` 合并为一个命令, 在编译 TypeScript 后自动执行路径替换。

  注意: 对于 `y-hooks` - `build:tsc` 命令执行 `node resolveImport.cjs`, 可以删除 `node resolveImport.cjs`,

  改为在 `tsconfig.json` 中正确配置 `tsc-alias` 即可.

### 环境支持

- `react`

- `typescript`

- `tslib` - [typescript-tslib](https://www.typescriptlang.org/zh/tsconfig/#importHelpers)

  ts 编译时辅助库, 能让 ts 编译成 js 时使用里面的函数, 减少打包体积.

  `@rollup/plugin-typescript` 需要依赖此库

- `prettier`

- [module-alias](https://www.npmjs.com/package/module-alias)

  似乎此项目没有使用到它

### 类型支持

- [@types/node](https://www.npmjs.com/package/@types/node)

- `@types/react`
