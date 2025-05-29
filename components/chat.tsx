"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Download, Trash2, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChatMessage } from "@/components/chat-message"
import { ConversationManager, type Conversation } from "@/lib/conversation-manager"

type Message = {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatProps {
  currentConversationId: string | null
  onConversationChange: (id: string | null) => void
}

export default function Chat({ currentConversationId, onConversationChange }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }

  // Scroll automático sempre que mensagens mudarem
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, isLoading])

  useEffect(() => {
    // Carregar conversa quando o ID muda
    if (currentConversationId) {
      const conversation = ConversationManager.getConversation(currentConversationId)
      if (conversation) {
        setMessages(conversation.messages)
      }
    } else {
      setMessages([])
    }
  }, [currentConversationId])

  const saveConversation = (updatedMessages: Message[]) => {
    if (updatedMessages.length === 0) return

    const conversationId = currentConversationId || Date.now().toString()

    const conversation: Conversation = {
      id: conversationId,
      title: updatedMessages[0]?.content.slice(0, 50) || "Nova Conversa",
      messages: updatedMessages,
      createdAt: currentConversationId
        ? ConversationManager.getConversation(currentConversationId)?.createdAt || new Date()
        : new Date(),
      updatedAt: new Date(),
    }

    ConversationManager.saveConversation(conversation)

    // Se é uma nova conversa, atualizar o ID
    if (!currentConversationId) {
      onConversationChange(conversationId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.response || "Erro na comunicação com o servidor")
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.response,
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, botMessage]
      setMessages(finalMessages)
      saveConversation(finalMessages)
    } catch (error) {
      console.error("Erro:", error)

      let errorMessage = "Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente."

      if (error instanceof Error) {
        if (error.message.includes("429")) {
          errorMessage = "Muitas solicitações. Aguarde um momento antes de tentar novamente."
        } else if (error.message.includes("autenticação")) {
          errorMessage = "Erro de configuração da API. Entre em contato com o suporte."
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."
        }
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: errorMessage,
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, errorMsg]
      setMessages(finalMessages)
      saveConversation(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const clearChat = () => {
    setMessages([])
    onConversationChange(null)
  }

  const downloadConversation = () => {
    if (messages.length === 0) return

    const conversation = {
      title: messages[0]?.content.slice(0, 50) + "..." || "Conversa",
      exportedAt: new Date().toISOString(),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      })),
    }

    const blob = new Blob([JSON.stringify(conversation, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `conversa-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <Card className="flex flex-col h-full overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-neutral-900/90 border-neutral-200/50 dark:border-neutral-700/50 shadow-2xl shadow-neutral-900/5 dark:shadow-neutral-900/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200/50 dark:border-neutral-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {currentConversationId ? "Conversa" : "Nova Conversa"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadConversation}
              disabled={messages.length === 0}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Baixar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Limpar</span>
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto"
          style={{
            scrollBehavior: "smooth",
            overflowAnchor: "none",
          }}
        >
          <div className="min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                  Olá! Como posso ajudar?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
                  Comece uma conversa digitando sua pergunta abaixo. Suas conversas são salvas automaticamente na barra
                  lateral.
                </p>
              </div>
            ) : (
              <div className="flex-1">
                <div className="space-y-6 p-6">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Pensando</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Elemento âncora para scroll */}
                <div ref={messagesEndRef} style={{ height: "1px" }} />
              </div>
            )}
          </div>
        </div>

        {/* Input Container */}
        <div className="p-4 border-t border-neutral-200/50 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-800/20 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  // Auto-resize
                  e.target.style.height = "auto"
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                }}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="min-h-[52px] max-h-[120px] resize-none pr-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:border-violet-500 dark:focus:border-violet-400 transition-colors"
                disabled={isLoading}
              />
              <div className="absolute right-3 bottom-3 text-xs text-neutral-400">
                {input.length > 0 && `${input.length} caracteres`}
              </div>
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-[52px] w-[52px] shrink-0 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
