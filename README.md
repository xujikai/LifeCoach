# DeepSeek R1 个人成长助手

这是一个基于火山方舟 DeepSeek R1 API 开发的个人成长助手网站。通过与 AI 进行对话，获取建议和指导，帮助用户在生活中不断成长。

## 项目结构

```
├── README.md          # 项目说明文档
├── package.json       # 项目依赖配置
├── server.js         # Node.js 后端服务
├── public/           # 静态资源目录
│   ├── index.html    # 主页面
│   ├── styles.css    # 样式文件
│   └── script.js     # 前端交互脚本
```

## 页面结构说明

### 主页面 (index.html)

页面采用响应式设计，主要包含以下部分：

1. 顶部导航栏
   - 网站标题
   - 主题切换按钮（明/暗模式）

2. 聊天界面
   - 对话历史区域（采用 Flexbox 布局）
   - 消息输入框
   - 发送按钮

3. 页面布局
   - 使用 CSS Grid 和 Flexbox 实现响应式布局
   - 在移动设备上自动调整布局

## 技术实现

1. 前端
   - 使用原生 HTML5 和 CSS3
   - 响应式设计，适配各种设备
   - 使用 Flexbox 和 Grid 布局
   - 添加加载动画和过渡效果

2. 后端
   - Node.js 服务器
   - 处理 API 密钥管理
   - 实现请求转发和流式输出
   - 处理 CORS 问题

## 性能优化

1. 前端优化
   - 使用 CSS 压缩
   - 延迟加载非关键资源
   - 优化图片加载

2. 后端优化
   - 设置合理的超时时间（60秒）
   - 实现错误处理和重试机制
   - 优化流式输出性能

## 安全措施

1. API 密钥保护
   - 在后端服务器中管理 API 密钥
   - 避免在前端暴露敏感信息

2. 请求验证
   - 验证用户输入
   - 限制请求频率

## 浏览器兼容性

- 支持所有主流现代浏览器
- 针对移动设备优化
- 优雅降级处理