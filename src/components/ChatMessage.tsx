import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: string;
  isDark: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, timestamp, isDark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md ${
        isBot 
          ? 'bg-purple-100 text-purple-500 dark:bg-purple-900 dark:text-purple-300' 
          : 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300'
      }`}>
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className={`flex max-w-[80%] flex-col ${isBot ? '' : 'items-end'}`}>
        <div className={`rounded-lg px-4 py-2 ${
          isBot 
            ? 'bg-white dark:bg-gray-800' 
            : 'bg-purple-500 text-white dark:bg-purple-600'
        }`}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">{timestamp}</span>
      </div>
    </motion.div>
  );
};