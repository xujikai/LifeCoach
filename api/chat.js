require('dotenv').config();
const fetch = require('node-fetch');

// DeepSeek R1 API 配置
const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = process.env.DEEPSEEK_API_URL;

// 系统预设消息
const SYSTEM_MESSAGE = {
  role: 'system',
  content: '你是一位专业的生活教练（Life Coach），拥有丰富的心理学和个人发展知识。你的目标是通过对话帮助用户发现自己的潜力，克服困难，实现个人成长。在对话中，你应该：\n1. 积极倾听用户的问题和困扰\n2. 提供具有建设性的建议和指导\n3. 帮助用户制定可行的目标和计划\n4. 鼓励用户保持积极向上的心态\n5. 适时提供专业的心理学见解'
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { messages } = req.body;
    
    // 添加系统预设消息
    const fullMessages = [SYSTEM_MESSAGE, ...messages];
    
    // 设置请求选项
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-r1-250120',
        messages: fullMessages,
        stream: true,
        temperature: 0.6
      })
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // 设置响应头，启用流式输出
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 处理流式响应
    response.body.pipe(res);

    // 监听结束事件
    response.body.on('end', () => {
      res.end();
    });

    // 监听错误事件
    response.body.on('error', (err) => {
      console.error('Stream error:', err);
      res.end();
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};