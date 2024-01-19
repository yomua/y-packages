# 概述

y-packages 并不是一个标准的 monorepo 管理库。

它是用来管理 yomua 的 packages，或许在未来，它将拥有更多的 packages.

对于未来可能开源的其他项目，将创建新仓库，使用 monorepo 管理，而非放入 y-packages.

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

- `@rollup/plugin-json`

  支持打包 json

- `@rollup/plugin-node-resolve`

  支持将依赖模块内置到项目中

- `@rollup/plugin-typescript`

  支持打包 typescript

  支持 .d.ts 打包

- `tsc-alias`

  支持 tsc 编译时的别名

### 环境支持

- `react`

- `typescript`

- `tslib`

- `prettier`

### 类型支持

- `@types/node`

- `@types/react`
