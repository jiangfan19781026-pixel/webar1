# 🐶 WebAR 3D Model Viewer

一个基于 React 和 Google Model Viewer 的 WebAR 项目，支持在移动设备上通过 AR 模式查看 3D 模型。

## 🌟 在线演示

👉 [点击访问在线演示](https://jiangfan19781026-pixel.github.io/webar1/)

在支持 AR 的移动设备上（iOS Safari 或 Android Chrome），点击"放置在房间里"按钮即可进入 AR 模式，将 3D 模型放置在真实环境中！

## 🛠️ 技术栈

- **React 19** - 现代化的前端框架
- **Three.js 0.172.0** - 强大的 3D 图形库
- **@google/model-viewer** - Google 的 Web 组件，用于展示 3D 模型和 AR
- **React Scripts 5.0** - Create React App 构建工具

## ✨ 功能特性

- 📱 支持移动端 AR 模式（Scene Viewer & Quick Look）
- 🎮 交互式 3D 模型查看（旋转、缩放）
- 🔄 自动旋转展示
- 💡 阴影效果
- 🎨 响应式设计

## 🚀 本地运行

### 前置要求

- Node.js (推荐 v16 或更高版本)
- npm 或 yarn

### 安装步骤

1. 克隆项目到本地

```bash
git clone https://github.com/jiangfan19781026-pixel/webar1.git
cd webar1
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm start
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 测试 AR 功能

要测试 AR 功能，需要：
- 使用支持 AR 的移动设备（iPhone 或 Android 手机）
- 通过局域网访问你的开发服务器（例如：`http://你的电脑IP:3000`）
- 或者部署到 HTTPS 服务器后访问

## 📦 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `build` 目录。

## 🚢 自动部署

本项目配置了 GitHub Actions 自动部署到 GitHub Pages。

### 部署流程

1. 每次推送代码到 `main` 分支时，GitHub Actions 会自动触发
2. 自动执行 `npm install` 和 `npm run build`
3. 将构建后的文件部署到 `gh-pages` 分支
4. 通过 GitHub Pages 访问部署后的网站

### 手动部署

如果需要手动部署，可以运行：

```bash
npm run deploy
```

### 配置说明

部署配置文件位于 `.github/workflows/deploy.yml`，主要步骤：

- ✅ 检出代码
- 📦 安装依赖并构建
- 🚀 部署到 GitHub Pages

## 📁 项目结构

```
webar1/
├── public/
│   └── dogpuppy.glb          # 3D 模型文件
├── src/
│   ├── App.js                # 主应用组件
│   └── index.js              # 入口文件
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 配置
├── package.json              # 项目依赖配置
└── README.md                 # 项目说明文档
```

## 🎯 使用自己的 3D 模型

1. 将你的 `.glb` 或 `.gltf` 模型文件放到 `public` 目录
2. 在 `src/App.js` 中修改 `src` 属性：

```jsx
<model-viewer
  src="/your-model.glb"
  // ... 其他属性
/>
```

## 📱 AR 模式支持

- **iOS**: Safari 浏览器，需要 iOS 12+ 和支持 ARKit 的设备
- **Android**: Chrome 浏览器，需要 Android 7.0+ 和支持 ARCore 的设备

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

⭐ 如果这个项目对你有帮助，欢迎给个 Star！
