import React from 'react';
import { PersonalityBot } from '../lib/chatbot';

interface ChatStatsProps {
  bot: PersonalityBot;
}

export const ChatStats: React.FC<ChatStatsProps> = ({ bot }) => {
  const stats = bot.getStats();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Learning Stats</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Personality Traits</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Array.from(stats.personalityTraits.entries()).map(([trait, { value }]) => (
              <div key={trait} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full dark:bg-purple-500"
                    style={{ width: `${value * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {trait}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Topic Understanding</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Array.from(stats.topicUnderstanding.entries()).map(([topic, value]) => (
              <div key={topic} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
                    style={{ width: `${value * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Conversations: {stats.conversationCount}
        </div>
      </div>
    </div>
  );
};