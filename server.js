import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa fileURLToPath
import dotenv from 'dotenv'; // Importa dotenv para carregar variáveis de ambiente

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = 3002;

// Obtém o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  // Usando path.dirname para obter o diretório

// Configuração da chave da API do OpenAI (mantenha segura no backend)
const API_KEY = process.env.API_GITHUB_TOKEN; // Certifique-se de que a chave está definida no .env

// Configuração do endpoint e modelo
const endpoint = "https://models.inference.ai.azure.com"; // Seu endpoint personalizado
const modelName = "gpt-4o-mini"; // O modelo que você quer usar

// Inicializando a API do OpenAI
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: API_KEY, // Usa a chave de API carregada do ambiente
  baseURL: endpoint, // Definindo o endpoint personalizado
});

// Middleware para aceitar JSON no corpo das requisições
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o 'index.html' automaticamente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para comunicação com o OpenAI
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Verifique se a mensagem foi recebida
    if (!userMessage) {
      return res.status(400).json({ error: 'Mensagem não fornecida' });
    }

    // Solicitação à API do OpenAI
    const response = await openai.chat.completions.create({
      model: modelName, // Usando o nome do modelo específico
      messages: [
        { role: 'system', content: 'Você é Gabi-GPT, a Assistente Oficial do Projeto Super Slim. Seu papel é oferecer dicas personalizadas de exercícios para as participantes.' },
        { role: 'user', content: userMessage },
      ],
    });

    // Retorne a resposta da IA para o frontend
    return res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('Erro ao acessar a API do OpenAI:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Inicia o servidor na porta 3002
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
