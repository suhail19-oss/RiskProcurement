"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, MicOff, X, Bot, User, Sparkles, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  typing?: boolean
}

<<<<<<< HEAD
=======
const predefinedResponses = {
  hello: "Hello! I'm your ESG assistant. How can I help you with your sustainability journey today?",
  help: "I can assist you with ESG data submission, sustainability metrics, compliance requirements, and best practices. What specific area would you like to explore?",
  esg: "ESG stands for Environmental, Social, and Governance. These are the three key factors used to measure the sustainability and ethical impact of an investment or business.",
  carbon:
    "Carbon emissions tracking is crucial for environmental reporting. I can help you understand carbon footprint calculation, reduction strategies, and reporting standards.",
  certification:
    "There are various sustainability certifications like ISO 14001, B-Corp, and Fair Trade. Which certification are you interested in learning about?",
  default:
    "That's an interesting question! While I'm still learning, I can help you with ESG data submission, sustainability metrics, and compliance. Could you rephrase your question or ask about a specific ESG topic?",
}

>>>>>>> supplier
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
<<<<<<< HEAD
        "Hi! I'm your assistant. I'm here to help you with sustainability questions, data submission guidance, and ESG best practices. How can I assist you today?",
=======
        "Hi! I'm your ESG assistant. I'm here to help you with sustainability questions, data submission guidance, and ESG best practices. How can I assist you today?",
>>>>>>> supplier
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isWaving, setIsWaving] = useState(false) // State for waving animation
  const [showHiText, setShowHiText] = useState(false) // State for "Hi" text

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // New useEffect for periodic waving and "Hi" text
  useEffect(() => {
    let waveInterval: NodeJS.Timeout
    let hiTextTimeout: NodeJS.Timeout

    if (!isOpen) {
      // Trigger initial wave and text after a short delay
      const initialDelay = setTimeout(() => {
        setIsWaving(true)
        setShowHiText(true)
        hiTextTimeout = setTimeout(() => {
          setIsWaving(false)
          setShowHiText(false)
        }, 3000) // Wave and show "Hi" for 3 seconds
      }, 5000) // Initial delay of 5 seconds

      // Set up subsequent waves and text every minute
      waveInterval = setInterval(() => {
        setIsWaving(true)
        setShowHiText(true)
        hiTextTimeout = setTimeout(() => {
          setIsWaving(false)
          setShowHiText(false)
        }, 3000) // Wave and show "Hi" for 3 seconds
      }, 60 * 1000) // Every 1 minute

      return () => {
        clearTimeout(initialDelay)
        clearInterval(waveInterval)
        clearTimeout(hiTextTimeout)
        setIsWaving(false)
        setShowHiText(false)
      }
    } else {
      // Reset states when chat is open
      setIsWaving(false)
      setShowHiText(false)
    }
  }, [isOpen])

<<<<<<< HEAD

=======
  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return response
      }
    }

    return predefinedResponses.default
  }
>>>>>>> supplier

  const GEMINI_API_KEY = "AIzaSyBWY904yt5tCcUt0r4r8Ljcn3w66y3Uz_o"

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
<<<<<<< HEAD
        GEMINI_API_KEY,
=======
          GEMINI_API_KEY,
>>>>>>> supplier
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
<<<<<<< HEAD
                    text: "You are an assistant for an application which is a supply chain based intelligent decison making tool named ProcurePro. Provide helpful, factual, and concise answers related to ESG, Cost Efficiency, Reliability, Overall Risk Assessment. Give the answer in 2-3 lines only for general questions. Give the response in no styling (non-bold, non-italic) format.",
=======
                    text: "You are an ESG assistant named Sustain Pro. Provide helpful, factual, and concise answers related to ESG, sustainability, and reporting. Give the answer in 2-3 lines only for general questions. Give the response in no styling (non-bold, non-italic) format.",
>>>>>>> supplier
                  },
                ],
              },
              {
                role: "user",
                parts: [{ text: userMessage.content }],
              },
            ],
          }),
        },
      )

      const data = await geminiResponse.json()

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't understand that."

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error calling Gemini:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Something went wrong while getting a response. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
<<<<<<< HEAD
  const recognitionRef = useRef<any>(null);
  const toggleVoiceInput = () => {
    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Check support
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionConstructor) {
        alert("Your browser does not support Speech Recognition.");
        return;
      }

      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        console.log("Transcribed:", transcript);
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    }
  };

=======

  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true)
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false)
        setInputValue("How can I improve my ESG score?")
      }, 2000)
    } else {
      setIsListening(false)
    }
  }
>>>>>>> supplier

  const speakMessage = (content: string) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  return (
    <>
<<<<<<< HEAD
=======
      {/* Chatbot Toggle Button */}
      {/* Chatbot Toggle Button */}
>>>>>>> supplier
      <div className="fixed bottom-3 right-3 z-50">
        <div className="relative w-16 h-16">
          {/* Robot image (floating above button) */}
          {!isOpen && (
            <img
              src="/images/waving-robot-new.png"
              alt="Waving Robot Chatbot"
              className={cn(
                "absolute bottom-5 z-10 left-0 w-11 h-10 object-contain pointer-events-none transition-all duration-500",
                isWaving ? "animate-wave" : "hover:animate-bounce-slow"
              )}
              style={{ transformOrigin: "bottom center" }}
            />
          )}

          {/* Hi bubble */}
          {!isOpen && showHiText && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full shadow-md z-20 animate-hi-bubble-wave">
              Hi!
            </span>
          )}

<<<<<<< HEAD
          {/* Toggle Button */}
          <Button
            onClick={toggleChat}
            aria-label="Toggle Chatbot"
            className={cn(
              "h-12 w-12 rounded-full shadow-md transition-all duration-300 relative",
              "bg-gradient-to-br from-purple-500 via-indigo-500 to-teal-400 hover:from-purple-600 hover:via-indigo-600 hover:to-teal-500",
              "transform hover:scale-105 active:scale-95",
              "border-2 border-white/20 hover:border-white/30",
              "shadow-md shadow-purple-500/20 hover:shadow-purple-500/30",
              isOpen && "rotate-90"
            )}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white z-10" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">

              </div>
            )}
          </Button>
        </div>
      </div>
=======
            {/* Toggle Button */}
            <Button
              onClick={toggleChat}
              aria-label="Toggle Chatbot"
              className={cn(
                "h-12 w-12 rounded-full shadow-md transition-all duration-300 relative",
                "bg-gradient-to-br from-purple-500 via-indigo-500 to-teal-400 hover:from-purple-600 hover:via-indigo-600 hover:to-teal-500",
                "transform hover:scale-105 active:scale-95",
                "border-2 border-white/20 hover:border-white/30",
                "shadow-md shadow-purple-500/20 hover:shadow-purple-500/30",
                isOpen && "rotate-90"
              )}
            >
              {isOpen ? (
                <X className="h-6 w-6 text-white z-10" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  
                </div>
              )}
            </Button>
          </div>
        </div>

>>>>>>> supplier


      {/* Chatbot Window */}
      {isOpen && (
<<<<<<< HEAD
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 w-96 h-[500px] transition-all duration-300",
            isMinimized ? "h-16" : ""
          )}
        >

          <Card
            className={cn(
              "h-full flex flex-col overflow-hidden",
              "shadow-xl border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800 transition-all duration-300"
            )}
          >
            <CardHeader
              className={cn(
                "pb-3 bg-gradient-to-r from-purple-500 to-purple-800 text-white",
                "rounded-t-lg cursor-pointer transition-all duration-200",
                "hover:from-blue-600 hover:to-sky-500",
              )}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6" />
                  <span className="font-semibold">Assistant</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </CardTitle>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Messages Area */}
                <ScrollArea
                  ref={scrollAreaRef}
                  className="flex-1 min-h-0 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50"
                >

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start space-x-2",
                        "transition-all duration-200 ease-out",
                        message.sender === "user" ? "justify-end" : "justify-start",
                        "animate-fade-in-up",
                      )}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8 bg-sky-100 dark:bg-blue-900/50">
                          <AvatarFallback className="bg-purple-500 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          "transition-all duration-200 hover:shadow-sm",
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white",
                          "animate-pop-in",
                        )}
                      >
                        <p>{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.sender === "bot" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-2 opacity-70 hover:opacity-100"
                              onClick={() => (isSpeaking ? stopSpeaking() : speakMessage(message.content))}
                            >
                              {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                            </Button>
                          )}
                        </div>
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50">
                          <AvatarFallback className="bg-blue-500 text-white">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-2 animate-fade-in">
                      <Avatar className="h-8 w-8 bg-sky-100 dark:bg-blue-900/50">
                        <AvatarFallback className="bg-blue-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" />
                          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="shrink-0 p-2 border-t bg-white dark:bg-gray-800 ">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about ESG, sustainability, or data submission..."
                        className="pr-12 focus-visible:ring-blue-500"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                          isListening && "text-red-500 animate-pulse",
                        )}
                        onClick={toggleVoiceInput}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!inputValue.trim()}
                      className={cn(
                        "h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700",
                        "transition-transform duration-150 active:scale-95",
                      )}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {isListening && (
                    <div className=" text-center">
                      <Badge variant="outline" className="animate-pulse text-blue-600 border-blue-300">
                        <Mic className="h-3 w-3 mr-1" />
                        Listening...
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
=======
  <div
    className={cn(
      "fixed bottom-24 right-6 z-50 w-96 transition-all duration-300",
      isMinimized ? "h-16" : "h-[500px]",
    )}
  >
    <Card
      className={cn(
        "h-full shadow-xl border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-800 transition-all duration-300",
        "flex flex-col overflow-hidden",
      )}
    >
      <CardHeader
        className={cn(
          "pb-3 bg-gradient-to-r from-purple-500 to-purple-800 text-white",
          "rounded-t-lg cursor-pointer transition-all duration-200",
          "hover:from-blue-600 hover:to-sky-500",
        )}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="font-semibold">ESG Assistant</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 h-full flex flex-col">
          {/* Messages Area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-2",
                  "transition-all duration-200 ease-out",
                  message.sender === "user" ? "justify-end" : "justify-start",
                  "animate-fade-in-up",
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 bg-sky-100 dark:bg-blue-900/50">
                    <AvatarFallback className="bg-purple-500 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    "transition-all duration-200 hover:shadow-sm",
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white",
                    "animate-pop-in",
                  )}
                >
                  <p>{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.sender === "bot" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2 opacity-70 hover:opacity-100"
                        onClick={() => (isSpeaking ? stopSpeaking() : speakMessage(message.content))}
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                </div>

                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50">
                    <AvatarFallback className="bg-blue-500 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-2 animate-fade-in">
                <Avatar className="h-8 w-8 bg-sky-100 dark:bg-blue-900/50">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-400" />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about ESG, sustainability, or data submission..."
                  className="pr-12 focus-visible:ring-blue-500"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                    isListening && "text-red-500 animate-pulse",
                  )}
                  onClick={toggleVoiceInput}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className={cn(
                  "h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700",
                  "transition-transform duration-150 active:scale-95",
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {isListening && (
              <div className="mt-2 text-center">
                <Badge variant="outline" className="animate-pulse text-blue-600 border-blue-300">
                  <Mic className="h-3 w-3 mr-1" />
                  Listening...
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  </div>
)}
>>>>>>> supplier

    </>
  )
}
