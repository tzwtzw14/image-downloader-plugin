# 图片批量下载器

一个 Chrome/Edge 浏览器扩展，用于一键下载网页中的所有图片。

![Snipaste_2025-03-18_18-42-07](https://github.com/user-attachments/assets/90e1f77f-855e-4771-8ed6-7b70469101b2)
![Snipaste_2025-03-18_18-42-37](https://github.com/user-attachments/assets/9c347e31-4d8f-48ec-b5bd-84937e63dde3)

## 功能特性

- 下载当前网页中的所有图片
- 支持 JPG、PNG、JPEG、GIF、WebP、SVG 格式
- 简单易用的弹出界面

## 安装方法

1. 下载或克隆本仓库
2. 在 Chrome/Edge 浏览器中打开`chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"，选择本项目的根目录

## 使用方法

1. 在任意网页中点击扩展图标
2. 在弹出的界面中点击"下载所有图片"
3. 图片将自动下载到默认下载目录

## 构建和打包

```bash
# 生成图标
npm run generate-icons

# 打包扩展
npm run package
```

## 许可证

MIT
