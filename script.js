const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');

let messageCount = 0;

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Simple markdown parser fallback
function simpleMarkdownParser(text) {
    return text
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

function createMessageElement(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'msg';
    
    const messageContainer = document.createElement('div');
    messageContainer.className = sender === 'user' ? 'user-message' : 'bot-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? 'You' : 'AI';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    if (sender === 'bot') {
        // Format markdown for bot messages
        let formattedText;
        if (typeof marked !== 'undefined') {
            formattedText = marked.parse(text);
        } else {
            formattedText = `<p>${simpleMarkdownParser(text)}</p>`;
        }
        content.innerHTML = `<div class="markdown">${formattedText}</div>`;
    } else {
        // Plain text for user messages
        content.innerHTML = text.replace(/\n/g, '<br>');
    }
    
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(content);
    messageDiv.appendChild(messageContainer);
    
    return messageDiv;
}

function appendMessage(text, sender) {
    const messageElement = createMessageElement(text, sender);
    chat.appendChild(messageElement);
    
    // Smooth scroll to bottom
    setTimeout(() => {
        chat.scrollTo({
            top: chat.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'msg';
    typingDiv.id = 'typing-indicator';
    
    const messageContainer = document.createElement('div');
    messageContainer.className = 'bot-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'AI';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = '<div class="loading">Thinking</div>';
    
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(content);
    typingDiv.appendChild(messageContainer);
    
    chat.appendChild(typingDiv);
    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: 'smooth'
    });
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Add user message
    appendMessage(text, 'user');
    
    // Clear input and resize
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Disable send button and show typing
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    showTypingIndicator();
    
    try {
        const response = await window.pywebview.api.send_message(text);
        removeTypingIndicator();
        appendMessage(response, 'bot');
    } catch (error) {
        console.error('Error sending message:', error);
        removeTypingIndicator();
        appendMessage('Sorry, I encountered an error. Please try again.', 'bot');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        messageInput.focus();
    }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    messageInput.focus(); // Focus once when page loads
    
    // Add welcome message
    setTimeout(() => {
        appendMessage('Hello! I\'m your AI assistant. How can I help you today?', 'bot');
    }, 500);
});

// Check if marked loaded successfully
window.addEventListener('load', function() {
    if (typeof marked === 'undefined') {
        console.warn('marked.js not loaded - using basic text formatting');
    }
});