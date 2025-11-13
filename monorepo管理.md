# yarn 如何管理 monorepo 方案?

配置参见：[yarn](https://classic.yarnpkg.com/en/docs/workspaces/)

使用 monorepo 方案时，各个包之间都存在各自的依赖，有些依赖可能是多个包都需要的，我们肯定是希望相同的依赖能提升到 root 目录下安装，其它的依赖装哪都行。

此时我们可以通过 yarn 来解决问题（npm 7 之前不行），需要在 package.json 中加上 `workspaces` 字段表明多包目录，它是一个数组，如：

```json
"workspaces": [
  "packages/*"
],
// or
"workspaces": [
  "packages/yscrew",
  "packages/y-indexeddb",
],
```

之后当我们安装依赖的时候，yarn 会尽量把依赖拍平装在根目录下，存在版本不同情况的时候会把使用最多的版本安装在根目录下，其它的就装在各自目录里。

这种看似正确的做法，可能又会带来更恶心的问题。

=> 比如多个 package 都依赖了 React，但是它们版本并不都相同。此时 node_modules 里可能就会存在这种情况：根目录下存在这个 React 的一个版本，包的目录中又存在另一个依赖的版本，

由于 node 寻找包的时候都是从最近目录开始寻找的，所以此时在开发的过程中可能就会出现多个 React 实例的问题，熟悉 React 开发的读者肯定知道这就会报错了。

遇到这种情况的时候，我们就得用 `resolutions` 去解决问题，当然也可以通过阻止 yarn 提升共同依赖来解决（更麻烦了）。笔者已经不止一次遇到过这种问题，多是安装**依赖的依赖**造成的多版本问题

# 快速上手

工作区（根目录）本身不需要被发布到 npm 这类包仓库, 因为它不是一个实际的包（或模块）。

工作区是一种组织多包项目的方式，它通过帮助管理包之间的依赖关系、提供共享依赖和更好地组织项目结构来改善项目管理。

# 常用命令

- `yarn workspaces info`
  显示当前 packages 的信息，其中 key 代表每个包的名字：每个包 `package.json  ` 的 name

- `yarn workspace <workspace_name> <command>`
  在指定的 package 中运行指定的命令，如：
  `yarn workspace @yomua/y-screw add react`: 将 React 添加到 `@yomua/y-screw` 项目中。

- `yarn <add|remove> <package> -W`

  `-W`: --ignore-workspace-root-check ，允许依赖被安装在 workspace 的根目录

- `yarn workspace <package-name> publish [--access=public]`

  将指定的 包（package.json 的 name） 发布到 npm

  注意: 中括号的意思代表可选, 并且首先你要切换仓库地址到 npm 的仓库.

  `[--access=public]`: 当需要把包发布到组织时，如果不是付费的，那么需要添加此命令才能发布共享包，否则只能是私有包。

- `yarn workspaces run build`

  空间下的所有包都执行 `yarn run build` 命令

  对于执行成功的成功打包, 执行失败的, 命令则中断.

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

# [如何在其他包中使用另一个包](https://classic.yarnpkg.com/lang/en/docs/workspaces/#toc-how-to-use-it)

例子:
对于在 @yomua/y-server 中使用 @yomua/y-screw, 可以直接通过

```js
// @yomua/y-server
import screw from '@yomua/y-screw'
```

可以这样直接使用，并不需要安装依赖到 `@yomua/y-server` 中，会正确的自动引用 `@yomua/y-screw` 包本地所在的位置。

- 前提: 需要 `yarn install`, 让 yarn 重新对 `packages/*` 目录进行解析并做 Symbolic Link.

=> 但是需要注意：对于依赖的包，你需要将 `@yomua/y-screw` 设置为 `@yomua/y-server` 的 dep 或 devDep.

=> 目的是, 能让人知道此项目依赖哪些包, 且打包的时候根据 dep 或 devDep 进行打包/不打包.

为什么能直接使用？ 因为 yarn 管理的 monorepo 会自动将你指定的目录 (在这里是 `packages/*`) 映射到根目录下的 node_modules.

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
  }
}
```

# FAQ

## 无法在一个包 a 中使用另一个包 b

1. 在包 a 中直接安装包 b

2. 在项目根目录 (y-packages/) 使用 `yarn install`, 让 yarn 重新对 `packages/*` 下的包进行链接.

Ref: <a href="#y-packages-中使用-packages-的项目">y-packages 中使用 `packages/*` 的项目</a>

## 引入包失败

如果在引用指定的包 (@yomua/y-screw) 时, 鼠标移上去没有发现: module "D:/code/y-packages/packages/y-assert/dist/index";

解决方法 1:

- 将它发布到 npm 仓库, 然后在使用它的地方 `yarn add -D 包名`, 安装一次;

=> 不太好, 不符合 monorepo 的初心 -> 实时使用其他包的最新代码.

解决方法 2:

- 在根目录使用 `yarn install`, 让 yarn 重新对 `packages/*` 目录进行解析并做 Symbolic Link.

Ref: <a href="#y-packages-中使用-packages-的项目">y-packages 中使用 `packages/*` 的项目</a>

## 使用发布命令时却发布到 yarn 的仓库？

这可能是因为你配置了 package.json, 然后使用 `yarn 命令` 的形式, 如:

```js
{
  scripts:{
    "p:screw": "yarn workspace @yomua/y-screw publish --access=public",
  }
}
```

执行:

- `yarn p:screw`

这会导致 publish 到 yarn 的仓库: `https://registry.yarnpkg.com`

解决方法是: 使用 `npm run 命令` 的形式,即:

- `npm run p:screw`

这样就能发布到 npm 仓库: `https://registry.npmjs.org`
