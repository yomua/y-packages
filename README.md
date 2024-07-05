# 概述

y-packages 并不是一个标准的 monorepo 管理库。

它是用来管理 yomua 的 packages，或许在未来，它将拥有更多的 packages.

对于未来可能开源的其他项目，将创建新仓库，使用 monorepo 管理，而非放入 y-packages.

# 快速开始

- `yarn -W` 

  `npm i -W`

- `yarn build`

  `npm run build`

安装所有依赖, 且构建所有包;

必须: node >= 18.0.0, 因为 rollup 需要依赖 >= 18.0.0 的 node

# Test

- `yarn test`

TIP: 只有当先完成 <a href='#快速开始'>快速开始</a>, 才能执行测试.
