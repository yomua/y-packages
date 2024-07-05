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

# `y-packages 中使用 packages/* 的项目`

你在 `packages/*` 的项目中， 会发现有使用了其他 `packages/*` 的项目， 但是却在 node_modules 中不存在, 仅仅只是将依赖写在了 package.json 中.

这没有什么问题, 因为 `import (mjs)`, `require (cjs)` 这类导入语句会自动寻找每一层的 node_modules,

即: 如果在当前项目没有找到, 则就会寻找根目录 `y-packages/node_modules`;

而 yarn workspace 管理工具会将你指定的目录 (在这里是 `packages/*`) 下的所有项目映射到 根目录/node_modules (`y-packages/node_modules`) 中,

=> 怎么做到的? 通过在项目根目录 (y-packages/) 使用 `yarn install`,

=> Ref: [yarn workspaces 的使用 ](https://classic.yarnpkg.com/lang/en/docs/workspaces/#toc-how-to-use-it)

所以每当我们对 `packages/*` 下的项目进行一次更改时, 都会映射到 `y-packages/node_modules/@yomua` 中;

=> 而每次对 `packages/*` 的项目进行 build 生成文件夹后, `y-packages/node_modules/@yomua` 对应的项目中也将会有此文件夹,

因此执行 `packages/*` 的项目 build 之后的文件时, 不用担心导入其他的 `packages/*` 的项目会报错 (比如: `import log from '@yomua/y-tlog`), 导入语句会自动寻找 `y-packages/node_modules/@yomua` 对应的项目.

TIP: 如果你去到 `packages/*` 的某个项目, 对其他项目进行导入, 然后再选择那个包点进去, vscode 只会进入到那个包本身的被引用的文件中, 而不会进入 `y-packages/node_modules`

TIP(不建议): 你可以在 y-packages 提前通过 `yarn add -D @yomua/y-* -W` 将包安装到 `y-packages/node_modules/@yomua` 中, 但这样就不符合使用 monorepo 的初心了 -> 实时使用其他包的最新代码. 


# 包的互相使用

例子:

对于在 @yomua/y-tlog 中使用 @yomua/y-screw, 可以直接通过

```js
import screw from '@yomua/y-screw'
```

当执行了 @yomua/y-tlog 项目中引用了 @yomua/y-screw 的某个文件时,

node 的模块解析策略如果在当前项目 (@yomua/y-tlog) 中的 node_modules 找不到引用的库 (@yomua/y-screw),

那么就会往上一级, 寻找父级目录, 这里是会寻找 packages/ 下的所有包.

## FAQ

### 引入包失败

如果在引指定的包 (@yomua/y-screw) 时, 鼠标移上去没有发现: module "D:/code/y-packages/packages/y-assert/dist/index";

解决方法 1:

- 将它发布到 npm 仓库, 然后在使用它的地方 `yarn add -D 包名`, 安装一次;

=> 不太好, 不符合 monorepo 的初心 -> 实时使用其他包的最新代码.

解决方法 2:

- 在根目录使用 `yarn install`, 让 yarn 重新对 `packages/*` 目录进行解析并做 Symbolic Link.

Ref: <a href="#y-packages-中使用-packages-的项目">y-packages 中使用 `packages/*` 的项目</a>

# 支持 cjs 和 esm

由于每个库中并没有对代码做任何判断是 cjs 或 esm 处理, 所以需要依赖 package.json 的字段, 

来告诉每个打包器 (如: webpack, vite, rollup), 和 Node.js, 

当使用者使用 require 或 import 导入模块时, 应该从哪个文件夹加载模块.

[exports](https://nodejs.cn/api/v20/packages.html#conditional-exports): 从 `Node.js v12.16.0 ` 开始, 支持此字段, 解决应当加载 cjs 还是 esm.

main, module, 优先级则是比 exports 低, 适合支持低版本 `Node < v12.16.0`

[type](https://nodejs.cn/api/v20/packages.html#type): 指定 `*.js` 被认为是哪种模块文件, 可取的值有: `commonjs`, `module`,

现在 node 默认值为 `commonjs`, 但应当始终包含此字段, 以防未来 node 将默认值改为 `module`, 且包含此字段语义更清晰.

- 注意: 包含此字段的前提是, 你没有自行对入口文件做 cjs 和 esm 判断, 来决定加载哪些文件.

```json
// package.json
{
  "type": "module", // 假定所有使用者通过 esm 加载模块
  "main": "./dist/cjs/index.cjs", // 为使用 cjs 加载的方式提供 cjs 模块
  "module": "./dist/index.js", // 为 esm 加载方式提供 esm 模块
  "types": "./dist/index.d.ts", // 提供类型声明文件
  "exports": {
    ".": {
      "types": "./dist/index.d.ts", // 提供类型声明文件
      "import": "./dist/index.js", // 提供 esm 模块
      "require": "./dist/cjs/index.cjs" // 提供 cjs 模块
    }
  },
}


```