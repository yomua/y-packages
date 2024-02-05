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

- `@yomua/y-tlog`

  执行 `yarn build` 时, 会先执行 `scripts/build.mjs`, 将应用在这里作为输出日志使用

### 类型支持

- `@types/node`

- `@types/react`

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

则会造成引入失败, 需要将它发布到 npm 仓库, 然后在使用它的地方 `yarn add -D 包名`, 安装一次;

然后就可以删除使用此包的另外一个包的 node_modules, 这样 node 就会正确解析了.

注意: 这并不是很正确, 因为 @yomua/y-enchant 此包不需要发布, 也能引用到; 

但是执行上述操作, 确实有用? 或许可以先在任意一个地方使用 yarn, 看看能不能正确引用, 相当于刷新一下 yarn?
