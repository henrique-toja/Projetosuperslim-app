// Inicialização ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    // Seleção dos elementos do DOM
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

    // Chama a função de obter resposta da API
    const botResponse = await getBotResponse(message);
    typingMessage.remove(); // Remove a mensagem de "digitando"
    addMessage(botResponse, 'bot', chatMessages);
}

// Função para obter resposta da API
async function getBotResponse(userMessage) {
    const API_ENDPOINT = "https://models.inference.ai.azure.com/v1/chat/completions"; 
    const API_KEY = API_GITHUB_TOKEN; // Substitua por sua chave real
    const MODEL_NAME = "gpt-4o-mini";

    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}` // Autorização com a chave da API
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    { 
                        role: "system", 
                        content: 
                            "Você é Gabi-GPT, a Assistente Oficial do Projeto Super Slim. " +
                            "Seu papel é oferecer dicas personalizadas de exercícios para as participantes, " +
                            "motivá-las e guiá-las em suas jornadas de emagrecimento. " +
                            "Seja acolhedora, prestativa e motivadora em suas respostas."
                    },
                    { role: "user", content: userMessage }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content; // Retorna a resposta do bot
    } catch (error) {
        console.error("Erro ao obter resposta do bot:", error);
        return "Desculpe, ocorreu um problema ao tentar processar sua mensagem. Tente novamente mais tarde.";
    }
}