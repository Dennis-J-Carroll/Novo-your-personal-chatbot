import { Conversation } from './types';

export class Storage {
  private readonly STORAGE_KEY = 'novo_chatbot_data';

  saveConversations(conversations: Conversation[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }

  loadConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
    return [];
  }
}