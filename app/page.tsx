"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Ship, Loader2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function VoyageEstimatorBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight
      }
    }
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue])

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: inputValue.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputValue("")
      setIsLoading(true)
      setError(null)

      try {
        // Prepare messages for OpenAI API (excluding the id and timestamp)
        const apiMessages = [
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: userMessage.role, content: userMessage.content }
        ]

        console.log('Sending request to API with messages:', apiMessages)

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: apiMessages }),
        })

        console.log('API response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('API error response:', errorData)
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('API success response:', data)
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message.content,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        console.error('Chat error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Ship className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Law's AI Voyage Estimator</h1>
            <p className="text-sm text-slate-500">Estimate commercial voyages using the latest AI technology </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Ship className="w-12 h-12 text-blue-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Estimate your next voyage   </h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Start a chat below to estimate a voyage, just describe your voyage!                   
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-slate-800 border border-blue-100 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="whitespace-pre-wrap text-sm leading-relaxed" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-slate-800" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    )}
                    <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-slate-400"}`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 border border-blue-100 rounded-2xl rounded-bl-md shadow-sm px-4 py-3 max-w-[85%] sm:max-w-[70%]">
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-slate-600">Assistant is typing...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex justify-start">
                  <div className="bg-red-50 text-red-800 border border-red-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3 max-w-[85%] sm:max-w-[70%]">
                    <div className="text-sm">
                      <strong>Error:</strong> {error}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input Bar */}
      <div className="bg-white border-t border-blue-100 p-4 shadow-lg">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Describe your voyage"
            className="flex-1 border border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-full px-4 py-2 resize-none text-sm transition-all"
            disabled={isLoading}
            rows={1}
            style={{ lineHeight: '1.5', overflow: 'hidden', maxHeight: '200px' }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 min-w-[44px] h-[44px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="text-xs text-slate-400 text-center mt-2">Enter voyage details for instant cost estimation</div>
      </div>
    </div>
  )
}
