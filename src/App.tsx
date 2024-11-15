import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ThemeToggle } from './components/ThemeToggle';
import { ChatStats } from './components/ChatStats';
import { PersonalityBot } from './lib/chatbot';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Hello! I'm Novo, your AI assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date().toLocaleTimeString(),
  },
];

const bot = new PersonalityBot();

function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [showStats, setShowStats] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Get bot response
    const response = await bot.generateResponse(text);
    
    const botMessage: Message = {
      id: messages.length + 2,
      text: response,
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleFeedback = (positive: boolean) => {
    bot.provideFeedback(positive);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4 transition-colors dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-[600px] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl transition-colors dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <MessageSquare className="h-5 w-5 text-purple-500 dark:text-purple-300" />
            </div>
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Novo</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>

        <div className="flex h-[calc(100%-8rem)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <ChatMessage
                    message={message.text}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                    isDark={isDark}
                  />
                  {message.isBot && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleFeedback(true)}
                        className="rounded p-1 text-gray-400 hover:text-green-500 dark:text-gray-600 dark:hover:text-green-400"
                      >
                        <ThumbsUp size={16} />
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="rounded p-1 text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400"
                      >
                        <ThumbsDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="w-64 border-l border-gray-100 dark:border-gray-800">
              <ChatStats bot={bot} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <ChatInput onSendMessage={handleSendMessage} isDark={isDark} />
        </div>
      </motion.div>
    </div>
  );
}

export default App;