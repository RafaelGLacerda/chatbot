"use client"

import { User, Bot, Copy, Check } from "lucide-react"
import { useState } from "react"

type Message = {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date)
  }

  return (
    <div className={`flex gap-4 group ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-xl shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white ml-3"
              : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 mr-3"
          }`}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
        <div className="flex flex-col">
          <div
            className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              isUser
                ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                : "bg-white text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
            {!isUser && (
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                title="Copiar mensagem"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-neutral-600 dark:text-neutral-400" />
                )}
              </button>
            )}
          </div>
          <div
            className={`mt-2 text-xs text-neutral-500 dark:text-neutral-400 ${
              isUser ? "text-right mr-1" : "text-left ml-1"
            }`}
          >
            {formatTime(new Date(message.timestamp))}
          </div>
        </div>
      </div>
    </div>
  )
}
