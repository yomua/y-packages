# 快速开始

- `yarn build`

  开始构建

- `yarn test`

  开始测试

# Module 说明

## y-assert/test

`index.mjs`: 通过 `yarn build`, 从 dist/index.js 复制过来, 再更改后缀名为 `.mjs` 得到;

目的: 用来作为 `src/\*.test.[mjs | cjs | js]` 文件导入 y-assert 功能的入口文件

# Test

执行测试命令: `yarn test`

创建测试文件: 在 `src` 目录下, 创建任意的 `*.test.[mjs | cjs | js]` 文件, 都会被作为测试文件执行.

TIP: 测试文件不会被打包到 dist 中, 因为在源码目录中, 不会有任何代码会引用它们, 测试文件仅用于在打包前进行测试功能正确性.

# FAQ

## 循环依赖

- `src/expect/`

1. ExpectClass 会依赖 equal, 同时 equal -> utils/index 又会依赖 ExpectClass

2. ExpectClass 会依赖 equal, 同时 equal -> utils/error 又会依赖 ExpectClass

3. src/index.ts -> src/expect/index.ts -> src/expect/ExpectClass.ts -> src/expect/equal.ts -> src/utils/error.ts -> src/utils/index.ts -> src/index.ts

这 3 处的循环依赖目前 (2024年1月30日) 没有问题.

因为引入依赖时, 对于依赖的使用是放到函数里面使用, 而不是在最顶层使用 (文件最底层, 没有包裹任何代码块, 而 import 在一个层级), 

所以就避免了循环依赖造成的顺序问题: 不知道哪个包应该是先引入, 哪个包后引入, 从而造成使用依赖时, 其变量出现没有声明就被使用的情况, 其构造函数没有声明就被 new 的情况等等.
