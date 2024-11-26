// Evento que ocorre quando o DOM está totalmente carregado
window.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    // Verificação dos elementos
    if (!messageInput || !sendButton || !chatMessages) {
        console.error("Erro: Elementos necessários não encontrados no DOM.");
        return;
    }

    // Exibe mensagem inicial ao carregar a página
    const welcomeMessage = 
        "Olá! Eu sou a Gabi-GPT, sua Assistente IA oficial do Projeto Super Slim. " +
        "Estou aqui para ajudar você com dicas personalizadas de exercícios físicos. " +
        "Como posso ajudar você hoje?";
    addMessage(welcomeMessage, 'bot', chatMessages);

    // Evento de clique no botão de envio
    sendButton.addEventListener('click', () => sendMessage(messageInput, chatMessages));

    // Evento de envio ao pressionar Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});

// Função para adicionar mensagens ao chat
function addMessage(message, type, chatMessages) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `message-${type}`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Rolagem automática para o final
}

// Função de envio de mensagem
async function sendMessage(messageInput, chatMessages) {
    const message = messageInput.value.trim();
    if (!message) {
        console.warn("Nenhuma mensagem para enviar.");
        return;
    }

    // Adiciona a mensagem do usuário ao chat
    addMessage(message, 'user', chatMessages);
    messageInput.value = '';

    // Exibe uma mensagem de "digitando" enquanto aguarda a resposta
    const typingMessage = document.createElement('div');
    typingMessage.classList.add('message', 'message-bot');
    typingMessage.textContent = 'Gabi-GPT está digitando...';
    chatMessages.appendChild(typingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Chama a função de obter resposta do servidor
    const botResponse = await getBotResponse(message);
    typingMessage.remove(); // Remove a mensagem de "digitando"
    addMessage(botResponse, 'bot', chatMessages);
}

// Função para obter resposta do servidor (que chama o OpenAI via API do servidor)
async function getBotResponse(userMessage) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }

        const data = await response.json();
        return data.response; // Retorna a resposta da Gabi-GPT
    } catch (error) {
        console.error('Erro ao obter resposta do bot:', error);
        return "Desculpe, ocorreu um problema ao tentar processar sua mensagem. Tente novamente mais tarde.";
    }
}
