# 日期和版本

## 2025-11-14 v0.1.2

### bug

- `toJSON`

能解析 bigInt, 且对 function 解析做了正确的处理

对代码优化

- `urlChange`

  减少了对 `fs`, `crypto` 的依赖, 防止在没有此依赖的情况下使用报错.

### 新功能

- 添加 `hashString`

### 优化

- `memoizeFn`

- `memoizeFnValue`
