"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { Send, Settings, X, RotateCcw } from "lucide-react"
import Link from "next/link"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatConfig {
  system_prompt: string | null
  temperature: number
  top_p: number
  max_tokens: number
  do_sample: boolean
}

const DEFAULT_SYSTEM_PROMPT =
  "Kamu adalah Waguri AI, asisten AI bilingual yang ramah dan membantu. Kamu bisa berkomunikasi dalam Bahasa Indonesia dan English dengan sopan dan jelas."

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello, how can I help you? 🌸",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isChatFocused, setIsChatFocused] = useState(false)

  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [temperature, setTemperature] = useState(0.7)
  const [topP, setTopP] = useState(0.9)
  const [maxTokens, setMaxTokens] = useState(256)
  const [doSample, setDoSample] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatCardRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatCardRef.current && !chatCardRef.current.contains(event.target as Node)) {
        setIsChatFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const resetSettings = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT)
    setTemperature(0.7)
    setTopP(0.9)
    setMaxTokens(256)
    setDoSample(true)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const config: ChatConfig = {
        system_prompt: systemPrompt || null,
        temperature,
        top_p: topP,
        max_tokens: maxTokens,
        do_sample: doSample,
      }

      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          config,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      const assistantContent = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

      setMessages((prev) => [...prev, { role: "assistant", content: assistantContent }])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-[#fff5f7] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden border-2 border-pink-200">
              <img
                src="/cute-anime-girl-avatar-with-pink-hair-waguri-ai-ma.jpg"
                alt="Waguri AI"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-semibold text-pink-400">Waguri AI</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-pink-500 font-medium border-b-2 border-pink-400 pb-1">
              Chat
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-pink-400 transition-colors">
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Welcome to Waguri AI</h1>
          <p className="text-gray-500">Your bilingual assistant for Indonesian & English</p>
        </div>

        {/* Chat Card Container - Added animation wrapper */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* Chat Card with focus animation */}
          <div
            ref={chatCardRef}
            onClick={() => setIsChatFocused(true)}
            className={`w-full bg-white rounded-3xl shadow-lg border border-pink-100 overflow-hidden cursor-pointer transition-all duration-300 ease-out ${
              isChatFocused
                ? "scale-100 shadow-xl ring-2 ring-pink-300 ring-opacity-50"
                : "scale-[0.98] hover:scale-[0.99] hover:shadow-lg"
            }`}
          >
            {/* Chat Background Pattern */}
            <div
              className="relative"
              style={{
                backgroundImage: "radial-gradient(circle, #f9d5e5 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {/* Messages Area - Dynamic height based on focus */}
              <div
                className={`overflow-y-auto p-6 space-y-4 transition-all duration-300 ${
                  isChatFocused ? "h-[450px]" : "h-[350px]"
                }`}
              >
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex-shrink-0 mr-3 overflow-hidden border border-pink-200">
                        <img
                          src="/cute-anime-girl-avatar-waguri-ai.jpg"
                          alt="Waguri AI"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-white border-2 border-pink-200 text-gray-800"
                          : "bg-pink-50 text-gray-800 border border-pink-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex-shrink-0 mr-3 overflow-hidden border border-pink-200">
                      <img
                        src="/cute-anime-girl-avatar-waguri-ai.jpg"
                        alt="Waguri AI"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-pink-50 text-gray-600 px-4 py-3 rounded-2xl border border-pink-100">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Waguri AI is thinking</span>
                        <div className="flex gap-1">
                          <span
                            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                            style={{ animationDuration: "0.6s", animationDelay: "0ms" }}
                          />
                          <span
                            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                            style={{ animationDuration: "0.6s", animationDelay: "150ms" }}
                          />
                          <span
                            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                            style={{ animationDuration: "0.6s", animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-pink-100 bg-white">
                {error && (
                  <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsChatFocused(true)}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none resize-none bg-white text-gray-800 placeholder-gray-400 transition-all"
                      style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="w-12 h-12 rounded-full bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 text-white flex items-center justify-center transition-colors shadow-md"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">Press Enter to send • Shift+Enter for new line</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-pink-200 text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-all shadow-sm"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>

        {showSettings && (
          <div
            className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowSettings(false)
            }}
          >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 p-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetSettings}
                    className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* System Prompt */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are Waguri AI, a friendly bilingual assistant..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:border-pink-400 focus:outline-none resize-none text-sm text-gray-800"
                />
              </div>

              {/* Temperature */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600">Temperature</label>
                  <span className="text-sm text-pink-500 font-medium">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                  className="w-full accent-pink-400"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.0</span>
                  <span>1.5</span>
                </div>
              </div>

              {/* Top-p */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600">Top-p</label>
                  <span className="text-sm text-pink-500 font-medium">{topP.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(Number.parseFloat(e.target.value))}
                  className="w-full accent-pink-400"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.0</span>
                  <span>1.0</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600">Max Tokens</label>
                  <span className="text-sm text-pink-500 font-medium">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="512"
                  step="16"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number.parseInt(e.target.value))}
                  className="w-full accent-pink-400"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>32</span>
                  <span>512</span>
                </div>
              </div>

              {/* Sampling Mode */}
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-600">Use sampling (creative mode)</span>
                  <div
                    onClick={() => setDoSample(!doSample)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      doSample ? "bg-pink-400" : "bg-gray-300"
                    } relative`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        doSample ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Our Machine Learning and Data Mining Final Project</p>
          <p className="text-pink-400">Powered by Qwen 2.5 + XLoRA Architecture</p>
        </footer>
      </main>
    </div>
  )
}
