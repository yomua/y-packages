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

# [如何在其他包中使用另一个包](https://classic.yarnpkg.com/lang/en/docs/workspaces/#toc-how-to-use-it) 

```js
// package @yomua/y-server 中使用 screw
import server from '@yomua/y-screw'
```

可以这样直接使用，并不需要安装依赖到 `@yomua/y-server` 中，会自动引用 `@yomua/y-screw` 包本地所在的位置。

=> 但是需要注意：你需要将 `@yomua/y-screw` 设置为 `@yomua/y-server` 的 dep 或 devDep.

=> 目的是, 能让人知道此项目依赖哪些包, 且打包的时候根据 dep 或 devDep 进行打包/不打包.

为什么？ 因为 yarn 管理的 monorepo 会自动将你指定的目录 (在这里是 `packages/*`) 映射到根目录下的 node_modules.

Ref: KNOW.md - `y-packages 中使用 packages/* 的项目`

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

# FAQ

## 无法在一个包 a 中使用另一个包 b

1. 在包 a 中直接安装包 b

2. 在项目根目录 (y-packages/) 使用 `yarn install`, 让 yarn 重新对 `packages/*` 下的包进行链接.

Ref: KNOW.md - `y-packages 中使用 packages/* 的项目`

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
