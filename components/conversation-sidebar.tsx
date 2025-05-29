"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Search, MessageSquare, Trash2, Edit2, Check, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConversationManager, type Conversation } from "@/lib/conversation-manager"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

interface ConversationSidebarProps {
  isOpen: boolean
  onClose: () => void
  currentConversationId: string | null
  onConversationSelect: (id: string | null) => void
}

export default function ConversationSidebar({
  isOpen,
  onClose,
  currentConversationId,
  onConversationSelect,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [mounted, setMounted] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null)

  useEffect(() => {
    setMounted(true)
    loadConversations()
  }, [])

  // Recarregar conversas quando a conversa atual muda
  useEffect(() => {
    if (mounted) {
      loadConversations()
    }
  }, [currentConversationId, mounted])

  const loadConversations = () => {
    if (typeof window !== "undefined") {
      const allConversations = ConversationManager.getAllConversations()
      setConversations(allConversations)
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages.some((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleNewConversation = () => {
    onConversationSelect(null)
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const handleSelectConversation = (id: string) => {
    onConversationSelect(id)
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const handleDeleteConversation = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversationToDelete(conversation)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteConversation = () => {
    if (conversationToDelete) {
      ConversationManager.deleteConversation(conversationToDelete.id)
      loadConversations()
      if (currentConversationId === conversationToDelete.id) {
        onConversationSelect(null)
      }
      setConversationToDelete(null)
    }
  }

  const handleEditTitle = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const handleSaveTitle = (id: string) => {
    if (editingTitle.trim()) {
      ConversationManager.updateConversationTitle(id, editingTitle.trim())
      loadConversations()
    }
    setEditingId(null)
    setEditingTitle("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle("")
  }

  const downloadAllConversations = () => {
    const allConversations = ConversationManager.getAllConversations()
    if (allConversations.length === 0) return

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalConversations: allConversations.length,
      conversations: allConversations.map((conv) => ({
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        messages: conv.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `todas-conversas-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } else if (diffInHours < 24 * 7) {
      return new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
      }).format(date)
    } else {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }).format(date)
    }
  }

  if (!isOpen || !mounted) return null

  return (
    <>
      <div className="h-full backdrop-blur-xl bg-white/90 dark:bg-neutral-900/90 border-r border-neutral-200/50 dark:border-neutral-700/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200/50 dark:border-neutral-700/50">
          <Button
            onClick={handleNewConversation}
            className="w-full justify-start gap-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Nova Conversa
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center text-neutral-500 dark:text-neutral-400">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">{searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}</p>
              <p className="text-xs mt-1">Comece uma nova conversa!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 ${
                    currentConversationId === conversation.id
                      ? "bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingId === conversation.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveTitle(conversation.id)
                              if (e.key === "Escape") handleCancelEdit()
                            }}
                            className="h-6 text-sm"
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSaveTitle(conversation.id)}
                            className="h-6 w-6"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            {formatDate(new Date(conversation.updatedAt))}
                          </p>
                        </>
                      )}
                    </div>

                    {editingId !== conversation.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => handleEditTitle(conversation, e)}
                          className="h-6 w-6 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => handleDeleteConversation(conversation, e)}
                          className="h-6 w-6 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadAllConversations}
            disabled={conversations.length === 0}
            className="w-full justify-start gap-2 text-neutral-600 dark:text-neutral-400"
          >
            <Download className="h-4 w-4" />
            Exportar Todas ({conversations.length})
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteConversation}
        title="Excluir conversa"
        description={`Tem certeza que deseja excluir a conversa "${conversationToDelete?.title}"? Esta ação não pode ser desfeita.`}
      />
    </>
  )
}
