'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { PaperAirplaneIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid';

export function AIAssistant({ matchContext, onClose }: { matchContext: any, onClose: () => void }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: {
      contextData: matchContext
    },
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: `Hi there! I'm your TxODDS AI Prediction Agent. I've analyzed the odds and stats for ${matchContext.homeTeam} vs ${matchContext.awayTeam}. What would you like to know before you make your prediction?`
      }
    ]
  } as any) as any;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-32px)] bg-zinc-950 border border-primary/30 shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-primary p-4 flex items-center justify-between text-black">
        <div className="flex items-center gap-2 font-bold">
          <SparklesIcon className="w-5 h-5" />
          <span>TxODDS AI Assistant</span>
        </div>
        <button onClick={onClose} className="hover:bg-black/10 p-1 rounded-lg transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900">
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-primary text-black rounded-tr-none' 
                : 'bg-zinc-800 text-zinc-200 border border-white/10 rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-white/10 text-zinc-400 p-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-zinc-950 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask for prediction advice..."
          className="flex-1 bg-zinc-900 text-white rounded-xl px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-primary"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="bg-primary text-black p-2 rounded-xl disabled:opacity-50 hover:bg-primary-dark transition-colors"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
