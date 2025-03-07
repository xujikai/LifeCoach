// 主题切换功能
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', body.dataset.theme);
});

// 从本地存储加载主题设置
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.dataset.theme = savedTheme;
}

// 聊天相关元素
const chatHistory = document.getElementById('chatHistory');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');

// 消息历史
let messageHistory = [];

// 自动调整输入框高度
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
});

// 发送消息函数
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // 添加用户消息到界面
    addMessageToChat('user', userMessage);
    messageHistory.push({ role: 'user', content: userMessage });

    // 清空输入框并重置高度
    userInput.value = '';
    userInput.style.height = 'auto';

    // 显示加载动画
    loadingIndicator.classList.remove('hidden');

    try {
        // 发送请求到后端
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messageHistory })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';

        // 创建 AI 消息容器
        const aiMessageContainer = createMessageElement('ai', '');
        chatHistory.appendChild(aiMessageContainer);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const jsonData = JSON.parse(data);
                        if (jsonData.choices && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                            const content = jsonData.choices[0].delta.content;
                            aiResponse += content;
                            aiMessageContainer.querySelector('.message-content').innerHTML = marked.parse(aiResponse);
                        }
                    } catch (e) {
                        console.error('解析数据失败:', e);
                    }
                }
            }
        }

        // 保存 AI 响应到消息历史
        messageHistory.push({ role: 'assistant', content: aiResponse });

    } catch (error) {
        console.error('错误:', error);
        addMessageToChat('ai', '抱歉，发生了错误，请稍后重试。');
    } finally {
        // 隐藏加载动画
        loadingIndicator.classList.add('hidden');
        // 滚动到底部
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}

// 创建消息元素
function createMessageElement(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    if (role === 'ai') {
        contentDiv.innerHTML = marked.parse(content);
    } else {
        contentDiv.textContent = content;
    }
    
    messageDiv.appendChild(contentDiv);
    return messageDiv;
}

// 添加消息到聊天界面
function addMessageToChat(role, content) {
    const messageElement = createMessageElement(role, content);
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 发送消息事件监听
sendButton.addEventListener('click', sendMessage);

// 按下回车键发送消息（Shift + Enter 换行）
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});