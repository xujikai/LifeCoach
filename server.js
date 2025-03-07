const express = require('express');
const path = require('path');
const app = express();

// 配置静态文件服务
app.use(express.static('public'));
app.use(express.json());

// 导入聊天API处理函数
const chatHandler = require('./api/chat.js');

// 配置API路由
app.post('/api/chat', chatHandler);

// 设置端口
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});