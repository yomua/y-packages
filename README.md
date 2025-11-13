# 概述

y-packages 并不是一个标准的 monorepo 管理库。

它只是用来管理 yomua 的 packages，或许在未来，它将拥有更多的 packages.

对于未来可能开源的其他项目，将创建新仓库，使用 monorepo 管理，而非放入 y-packages.

# 快速开始

- `yarn -W`

  `npm i -W`

忽略 workspace 的检查, 允许依赖被安装在 workspace 的根目录

TIP: -W 是 `--ignore-workspace-root-check` 的简写。

只有当确实要在根目录共用依赖时才用 -W；

子包自己独立依赖就不用 -W。

- `yarn build`

  `npm run build`

安装所有依赖, 且构建所有包;

必须: node >= 18.0.0, 因为 rollup 需要依赖 >= 18.0.0 的 node

注意: 这只是代表开发这个库的时候需要 node 版本, 当打包好成 js 之后, 则只需要 js 版本是正确的 (通常这个不会有问题)

# Test

- `yarn test`

TIP: 只有当先完成 <a href='#快速开始'>快速开始</a>, 才能执行测试.

# CDN

所有库的 CDN 都可以通过 [unpkg](https://www.unpkg.com/) 加载.

例如 @yomua/y-screw

- https://www.unpkg.com/@yomua/y-screw@0.1.1/dist/index.js

  https://www.unpkg.com/@yomua/y-screw@0.1.1/dist/cjs/index.js

  你可以直接输入: https://www.unpkg.com/@yomua/y-screw, 这会自动得到对应的网址

# FAQ

`scripts/resolveImport.cjs`

此文件用来解析使用 `tsc` 编辑 `*.ts` 文件时的导入路径不完整问题, 为路径补充正确的后缀, 如:

```ts
// import store from '../store'; // 改变为下面这个
import store from '../store.js'

// import useUrl from './useUrl'; // 改变为下面这个
import useUrl from './useUrl/index.js'
```

- 为什么 `y-simdux` 使用 `resolveImport.cjs`, 而 `y-hooks` 使用 `tsc-alias`

[tsc-alias](https://www.npmjs.com/package/tsc-alias) 不仅支持解析路径成完整文件路径, 还支持解析路径别名.

而最开始写项目时 `tsc-alias` 没有正确配置 `tsconfig.json` 导致没有生效, 所以自己写了一个 `resolveImport.cjs` 来进行解析.

为了更好的理解一个 ts 项目从编写 -> 编译成 js -> 打包(代码压缩, 优化等) 的流程, 所以在 `y-hooks` 中保留使用 `resolveImport.cjs`
