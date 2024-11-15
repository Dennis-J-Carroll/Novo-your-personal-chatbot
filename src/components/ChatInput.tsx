import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDark: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDark }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-purple-500 dark:focus:ring-purple-900"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="absolute right-2 rounded-md p-2 text-gray-400 transition-colors hover:text-purple-500 dark:text-gray-500 dark:hover:text-purple-400"
      >
        <Send size={20} />
      </motion.button>
    </form>
  );
};