# 🤖 AI Assistant - Chatbot Moderno

Um chatbot moderno e minimalista construído com Next.js, Tailwind CSS e OpenRouter AI.

## ✨ Características

- **Design Moderno**: Interface minimalista com glassmorphism e gradientes sutis
- **Tema Claro/Escuro**: Alternância automática entre temas
- **Armazenamento Local**: Conversas salvas automaticamente no navegador
- **Download de Conversas**: Exporte conversas individuais ou todas em JSON
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Animações Suaves**: Micro-interações para melhor UX

## 🚀 Deploy no Vercel

### 1. Configuração Rápida

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 2. Variáveis de Ambiente

Configure as seguintes variáveis no painel do Vercel:

\`\`\`bash
OPENROUTER_API_KEY=sua_chave_openrouter_aqui
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
\`\`\`

### 3. Como obter a API Key

1. Acesse [OpenRouter.ai](https://openrouter.ai)
2. Crie uma conta gratuita
3. Vá para "API Keys" no dashboard
4. Gere uma nova chave
5. Adicione créditos (muitos modelos têm tier gratuito)

## 🛠️ Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone ou baixe o projeto**

2. **Instale as dependências:**
\`\`\`bash
npm install
\`\`\`

3. **Configure as variáveis de ambiente:**
\`\`\`bash
# Crie um arquivo .env.local
OPENROUTER_API_KEY=sua_chave_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

4. **Execute o projeto:**
\`\`\`bash
npm run dev
\`\`\`

5. **Acesse:** [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

\`\`\`
├── app/
│   ├── api/chat/route.ts      # API route para o chatbot
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página inicial
├── components/
│   ├── ui/                    # Componentes UI (shadcn)
│   ├── chat.tsx               # Componente principal do chat
│   ├── chat-message.tsx       # Componente de mensagem
│   └── theme-provider.tsx     # Provider de tema
├── lib/
│   ├── conversation-manager.ts # Gerenciador de conversas
│   └── utils.ts               # Utilitários
└── package.json
\`\`\`

## 💾 Formato do JSON Exportado

\`\`\`json
{
  "exportedAt": "2024-01-15T10:30:00.000Z",
  "totalConversations": 5,
  "conversations": [
    {
      "id": "1705312200000",
      "title": "Como criar um chatbot...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z",
      "messages": [
        {
          "role": "user",
          "content": "Como criar um chatbot?",
          "timestamp": "2024-01-15T10:30:00.000Z"
        },
        {
          "role": "bot",
          "content": "Para criar um chatbot...",
          "timestamp": "2024-01-15T10:30:05.000Z"
        }
      ]
    }
  ]
}
\`\`\`

## 🎨 Personalização

### Cores e Tema

Edite `app/globals.css` para personalizar as cores:

\`\`\`css
:root {
  --primary: 262.1 83.3% 57.8%; /* Cor principal */
  --background: 0 0% 100%;       /* Fundo */
  --foreground: 0 0% 3.9%;       /* Texto */
}
\`\`\`

### Modelos de IA

Altere o modelo em `app/api/chat/route.ts`:

\`\`\`typescript
// Modelos disponíveis (alguns gratuitos):
"mistralai/mistral-7b-instruct"     // Gratuito
"meta-llama/llama-3.1-8b-instruct"  // Gratuito
"google/gemma-2-9b-it"              // Gratuito
"openai/gpt-3.5-turbo"              // Pago
\`\`\`

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Verificar código
\`\`\`

## 📱 Funcionalidades

- ✅ Chat em tempo real com IA
- ✅ Salvamento automático de conversas
- ✅ Download de conversas em JSON
- ✅ Tema claro/escuro
- ✅ Design responsivo
- ✅ Copiar mensagens
- ✅ Indicadores de digitação
- ✅ Tratamento de erros
- ✅ Auto-scroll
- ✅ Contador de caracteres

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se as variáveis de ambiente estão configuradas
2. Confirme se sua API key do OpenRouter está válida
3. Verifique o console do navegador para erros
4. Abra uma issue no repositório

---

Desenvolvido com ❤️ usando Next.js e Tailwind CSS
