import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, MessageCircleHeart, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const QUICK_PROMPTS = [
  'Tell me about yourself 🧸',
  'Tell me a bedtime story 🌙',
  'Show me your creations 🎨',
  'Cheer me up ♡',
];

export const TedChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "hiii!! ♡ i'm ted 🧸 wanna explore my dreamland or hear a tiny bedtime story?",
      timestamp: 'just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input on desktop
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    // Guard against blank messages or duplicate requests while already waiting
    if (!text || isLoading) return;

    soundManager.playPop();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    // 1. Immediately show typing indicator for zero-delay perceived response
    setIsLoading(true);

    const assistantMsgId = `ted-${Date.now()}`;
    let streamedText = '';
    let hasCreatedBubble = false;

    try {
      // 2. Fetch with streaming enabled
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stream: true,
          messages: newMessages
            .filter((m) => !m.isError)
            .map((m) => ({
              role: m.role,
              text: m.text,
            })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Connection glitch in dreamland');
      }

      if (!response.body) {
        throw new Error('Streaming not supported by browser');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              throw new Error(parsed.message || parsed.error);
            }
            if (parsed.text) {
              streamedText += parsed.text;
              if (!hasCreatedBubble) {
                // First token received: hide indicator and spawn speech bubble
                hasCreatedBubble = true;
                setIsLoading(false);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: assistantMsgId,
                    role: 'assistant',
                    text: streamedText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              } else {
                // Subsequent tokens: update bubble text progressively
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, text: streamedText } : m))
                );
              }
              scrollToBottom();
            }
          } catch (jsonErr: any) {
            if (jsonErr.message && jsonErr.message.includes('eep!')) {
              throw jsonErr;
            }
          }
        }
      }

      if (!streamedText.trim()) {
        throw new Error('Empty reply received');
      }

      soundManager.playChime();
    } catch (err: any) {
      console.warn('Ted chat error:', err);
      if (hasCreatedBubble) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  isError: true,
                  text: 'eep! ted lost his dream connection for a tiny second... can we try again? ♡',
                }
              : m
          )
        );
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            text: 'eep! ted lost his dream connection for a tiny second... can we try again? ♡',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const retryLastMessage = () => {
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      // Remove any trailing error message
      setMessages((prev) => prev.filter((m) => !m.isError));
      handleSendMessage(lastUserMsg.text);
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center">
          <button
            onClick={() => {
              soundManager.playPop();
              setIsOpen(true);
            }}
            className="btn-chunky group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white hover:bg-[#FFF2F6] border-3 border-[#3B1B3C] rounded-full shadow-retro-plum cursor-pointer"
            title="Open chat with Little Ted ♡"
            aria-label="Open chat with Little Ted"
          >
            {/* Ted Mascot Face SVG */}
            <div className="w-8 h-8 relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
                {/* Ears */}
                <circle cx="26" cy="28" r="14" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3.5" />
                <circle cx="26" cy="28" r="8" fill="#FFC9D9" />
                <circle cx="74" cy="28" r="14" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3.5" />
                <circle cx="74" cy="28" r="8" fill="#FFC9D9" />
                {/* Head */}
                <circle cx="50" cy="56" r="34" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="3.5" />
                {/* Cheeks */}
                <ellipse cx="32" cy="62" rx="6" ry="3.5" fill="#FF8CA3" opacity="0.75" />
                <ellipse cx="68" cy="62" rx="6" ry="3.5" fill="#FF8CA3" opacity="0.75" />
                {/* Snout */}
                <ellipse cx="50" cy="64" rx="14" ry="10" fill="#FFF2E2" stroke="#3B1B3C" strokeWidth="2" />
                {/* Nose */}
                <path d="M 46 59 C 46 56 54 56 54 59 C 54 62 50 63 50 63 C 50 63 46 62 46 59 Z" fill="#8B3A62" />
                {/* Smile */}
                <path d="M 46 66 Q 50 69 54 66" fill="none" stroke="#3B1B3C" strokeWidth="2" strokeLinecap="round" />
                {/* Eyes */}
                <circle cx="38" cy="50" r="3" fill="#3B1B3C" />
                <circle cx="37" cy="49" r="1" fill="#FFF" />
                <circle cx="62" cy="50" r="3" fill="#3B1B3C" />
                <circle cx="61" cy="49" r="1" fill="#FFF" />
                {/* Tiny Star Pin */}
                <polygon points="76,18 78,24 84,24 79,27 81,33 76,29 71,33 73,27 68,24 74,24" fill="#FFE66D" stroke="#3B1B3C" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Label */}
            <div className="flex flex-col text-left pr-1">
              <span className="text-xs sm:text-sm font-extrabold text-[#751A3D] font-display leading-tight flex items-center gap-1">
                <span>Talk to Ted</span>
                <span className="text-[#FF70B8] group-hover:rotate-12 transition-transform">♡</span>
              </span>
              <span className="text-[10px] text-[#A24269] font-retro font-bold">online ☁️</span>
            </div>

            {/* Notification Pulse Dot */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF5964] border-2 border-[#3B1B3C] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF5964] border-2 border-[#3B1B3C] rounded-full" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with Ted"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] h-[540px] max-h-[85vh] flex flex-col bg-[#FFFDF9] border-3 border-[#3B1B3C] rounded-3xl shadow-retro-plum-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-[#FFEBF2] border-b-2 border-[#3B1B3C] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Ted Mini Face Avatar */}
              <div className="w-8 h-8 rounded-full bg-white border-2 border-[#3B1B3C] p-0.5 shrink-0 shadow-xs">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="26" cy="28" r="14" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="4" />
                  <circle cx="74" cy="28" r="14" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="4" />
                  <circle cx="50" cy="56" r="34" fill="#F4BA8D" stroke="#3B1B3C" strokeWidth="4" />
                  <ellipse cx="32" cy="62" rx="6" ry="3.5" fill="#FF8CA3" />
                  <ellipse cx="68" cy="62" rx="6" ry="3.5" fill="#FF8CA3" />
                  <ellipse cx="50" cy="64" rx="14" ry="10" fill="#FFF2E2" stroke="#3B1B3C" strokeWidth="2" />
                  <circle cx="50" cy="58" r="3" fill="#8B3A62" />
                  <circle cx="38" cy="50" r="3" fill="#3B1B3C" />
                  <circle cx="62" cy="50" r="3" fill="#3B1B3C" />
                </svg>
              </div>

              <div className="flex flex-col text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#751A3D] text-sm font-display">
                    a little chat with ted ♡
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-retro text-[#8B3A62] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>here with you ☁️</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                soundManager.playPop();
                setIsOpen(false);
              }}
              className="w-7 h-7 rounded-xl bg-white hover:bg-[#FFE66D] border-2 border-[#3B1B3C] text-[#3B1B3C] font-extrabold flex items-center justify-center text-xs shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
              aria-label="Close chat"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-notebook-pattern bg-white/70">
            {messages.map((msg) => {
              const isTed = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isTed ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 text-xs sm:text-sm font-medium leading-relaxed transition-all ${
                      isTed
                        ? msg.isError
                          ? 'bg-[#FFF0F2] text-[#9F1239] border-2 border-[#FDA4AF] rounded-2xl rounded-tl-xs shadow-xs'
                          : 'bg-[#FFEBF2] text-[#5C1D38] border-2 border-[#FFC2DB] rounded-2xl rounded-tl-xs shadow-xs'
                        : 'bg-[#FFF8EA] text-[#4A1D36] border-2 border-[#FFE2A4] rounded-2xl rounded-tr-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Retry button if this message was an error */}
                    {msg.isError && (
                      <button
                        onClick={retryLastMessage}
                        className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FFE66D] border border-[#3B1B3C] rounded-lg text-[11px] font-bold text-[#3B1B3C] shadow-xs cursor-pointer transition-transform hover:scale-105"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>try again ♡</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[9px] font-retro text-[#A2678A] mt-1 px-1">
                    {isTed ? 'ted · ' : 'you · '} {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Bouncing Stars Typing Indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-[#FFEBF2] border-2 border-[#FFC2DB] rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-xs flex items-center gap-1.5 text-xs text-[#8B1E4B] font-retro font-bold">
                  <span>ted is thinking</span>
                  <span className="animate-bounce delay-0 text-[#FF70B8]">⭐</span>
                  <span className="animate-bounce delay-150 text-[#B99AFF]">☁️</span>
                  <span className="animate-bounce delay-300 text-[#FFE66D]">⭐</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-[#FFF8FA] border-t border-[#FFD6E8] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                disabled={isLoading}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] font-bold text-[#8B1E4B] bg-white hover:bg-[#FFEBF2] border border-[#FBCFE8] hover:border-[#FFB3D1] rounded-full shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t-2 border-[#3B1B3C] flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="tell ted something..."
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#FFF9F5] border-2 border-[#FBCFE8] focus:border-[#FF70B8] rounded-xl outline-none font-medium text-[#4A1D36] placeholder-[#A2678A]"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              aria-label="Send message to Ted"
              className="btn-chunky p-2.5 rounded-xl bg-[#FF70B8] hover:bg-[#FF599F] disabled:bg-gray-200 border-2 border-[#3B1B3C] text-white disabled:text-gray-400 shadow-retro-plum-sm flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
