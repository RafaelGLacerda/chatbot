"use client"

import { useState, useEffect } from "react"
import Chat from "@/components/chat"
import ConversationSidebar from "@/components/conversation-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-stone-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23000000&quot; fillOpacity=&quot;0.02&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.02&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        {/* Sidebar */}
        <div
          className={`relative z-20 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-80" : "w-0"} lg:w-80 flex-shrink-0`}
        >
          <ConversationSidebar
            isOpen={sidebarOpen || isLargeScreen}
            onClose={() => setSidebarOpen(false)}
            currentConversationId={currentConversationId}
            onConversationSelect={setCurrentConversationId}
          />
        </div>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative z-10 min-w-0">
          <header className="backdrop-blur-xl bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200/50 dark:border-neutral-800/50 flex-shrink-0">
            <div className="flex items-center h-16 px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-3"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">AI Assistant</h1>
              </div>

              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6 overflow-hidden">
            <Chat currentConversationId={currentConversationId} onConversationChange={setCurrentConversationId} />
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

function ThemeToggle() {
  return (
    <button
      className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-200 group"
      onClick={() => {
        document.documentElement.classList.toggle("dark")
        localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light"
      }}
    >
      <span className="sr-only">Alternar tema</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden dark:block text-amber-400 group-hover:rotate-12 transition-transform duration-200"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="block dark:hidden text-neutral-600 group-hover:rotate-12 transition-transform duration-200"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  )
}
