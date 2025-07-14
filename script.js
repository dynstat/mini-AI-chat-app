const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');

function simpleMarkdownParser(text) {
    return text
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Line breaks
        .replace(/\n/g, '<br>');
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = 'msg ' + sender;
    if (sender === 'bot') {
        // Use marked.js if available, otherwise use simple parser
        let formattedText;
        if (typeof marked !== 'undefined') {
            formattedText = marked.parse(text);
        } else {
            formattedText = simpleMarkdownParser(text);
        }
        div.innerHTML = `<b>AI:</b> <div class="markdown">${formattedText}</div>`;
    } else {
        div.innerHTML = `<b>You:</b> ${text}`;
    }
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

sendBtn.onclick = async function() {
    const text = messageInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    messageInput.value = '';
    sendBtn.disabled = true;
    try {
        const response = await window.pywebview.api.send_message(text);
        appendMessage(response, 'bot');
    } catch (error) {
        console.error('Error sending message:', error);
        appendMessage('Error: Could not get response from AI', 'bot');
    }
    sendBtn.disabled = false;
    messageInput.focus();
};

messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendBtn.click();
});