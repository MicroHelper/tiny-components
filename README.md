# tiny-components

## install

在项目目录的 .npmrc 文件中增加一行（如没有该文件则创建一个）

```diff
+ @microhelper:registry=https://npm.pkg.github.com
```

运行以下命令（其中 react react-dom 为 peer dependencies ）

```bash
npm install @microhelper/tiny-components
```

### 引入 css

在项目顶层组件中引入 css

```js
import "@microhelper/tiny-components/dist/tiny-components.css";
```

### 引用组件

```js
import { Modal } from "@microhelper/tiny-components";
```
