export type Message = {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export class ConversationManager {
  private static readonly STORAGE_KEY = "chatbot_conversations"
  private static readonly LAST_CONVERSATION_KEY = "chatbot_last_conversation"

  static saveConversation(conversation: Conversation): void {
    try {
      const conversations = this.getAllConversations()
      const existingIndex = conversations.findIndex((c) => c.id === conversation.id)

      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation
      } else {
        conversations.push(conversation)
      }

      // Manter apenas as últimas 100 conversas
      const sortedConversations = conversations
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 100)

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sortedConversations))
      localStorage.setItem(this.LAST_CONVERSATION_KEY, conversation.id)
    } catch (error) {
      console.error("Erro ao salvar conversa:", error)
    }
  }

  static getAllConversations(): Conversation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []

      const conversations = JSON.parse(stored)
      return conversations
        .map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        .sort((a: Conversation, b: Conversation) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } catch (error) {
      console.error("Erro ao carregar conversas:", error)
      return []
    }
  }

  static getConversation(id: string): Conversation | null {
    const conversations = this.getAllConversations()
    return conversations.find((c) => c.id === id) || null
  }

  static getLastConversation(): Conversation | null {
    try {
      const lastId = localStorage.getItem(this.LAST_CONVERSATION_KEY)
      if (!lastId) return null
      return this.getConversation(lastId)
    } catch (error) {
      console.error("Erro ao carregar última conversa:", error)
      return null
    }
  }

  static deleteConversation(id: string): void {
    try {
      const conversations = this.getAllConversations()
      const filtered = conversations.filter((c) => c.id !== id)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))

      const lastId = localStorage.getItem(this.LAST_CONVERSATION_KEY)
      if (lastId === id) {
        localStorage.removeItem(this.LAST_CONVERSATION_KEY)
      }
    } catch (error) {
      console.error("Erro ao deletar conversa:", error)
    }
  }

  static updateConversationTitle(id: string, newTitle: string): void {
    try {
      const conversations = this.getAllConversations()
      const conversation = conversations.find((c) => c.id === id)

      if (conversation) {
        conversation.title = newTitle
        conversation.updatedAt = new Date()
        this.saveConversation(conversation)
      }
    } catch (error) {
      console.error("Erro ao atualizar título da conversa:", error)
    }
  }

  static clearAllConversations(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.LAST_CONVERSATION_KEY)
    } catch (error) {
      console.error("Erro ao limpar conversas:", error)
    }
  }

  static exportConversations(): string {
    const conversations = this.getAllConversations()
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalConversations: conversations.length,
        conversations,
      },
      null,
      2,
    )
  }
}
