# v-scroll

原生 Web Components 虚拟滚动条组件

## 功能特性

- 基于原生滚动 + 自定义外观
- Shadow DOM 样式隔离
- ResizeObserver 动态尺寸探测
- Pointer Events 指针捕捉
- CSS 变量支持主题定制
- Import Map 支持主题切换

## 使用方式

```html
<v-scroll>
  <p>内容段落...</p>
</v-scroll>

<script type="module" src="./src/v-scroll.js"></script>
```

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 项目结构

```
v-scroll/
├── package.json
├── vite.config.js
├── plugins/css-plugin.js
├── src/
│   ├── v-scroll.css
│   ├── v-scroll.js
│   └── v-scroll-css.js
├── index.html
└── public/svg/
```
