import { EMOTIONS, INTEREST_TOPICS, Emotion, Topic, Conversation } from './types';
import { Storage } from './storage';
import { LearningSystem } from './learning';

export class PersonalityBot {
  private storage: Storage;
  private learning: LearningSystem;
  private conversations: Conversation[];
  private maxMemory: number;

  constructor() {
    this.storage = new Storage();
    this.learning = new LearningSystem();
    this.conversations = this.storage.loadConversations();
    this.maxMemory = 50;
    
    // Initial learning from stored conversations
    this.learning.learn(this.conversations);
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
  }

  private detectEmotion(text: string): { emotion: Emotion; confidence: number } {
    const tokens = this.tokenize(text);
    const emotionScores = new Map<Emotion, number>();

    EMOTIONS.forEach(emotion => emotionScores.set(emotion, 0));

    tokens.forEach(token => {
      if (['happy', 'joy', 'great', 'excellent', 'amazing'].includes(token)) {
        emotionScores.set('happy', (emotionScores.get('happy') || 0) + 1);
      } else if (['sad', 'unhappy', 'disappointed', 'sorry'].includes(token)) {
        emotionScores.set('sad', (emotionScores.get('sad') || 0) + 1);
      } else if (['curious', 'interested', 'wonder', 'how', 'why'].includes(token)) {
        emotionScores.set('curious', (emotionScores.get('curious') || 0) + 1);
      } else if (['excited', 'wow', 'awesome', 'fantastic'].includes(token)) {
        emotionScores.set('excited', (emotionScores.get('excited') || 0) + 1);
      } else if (['worried', 'anxious', 'nervous', 'concerned'].includes(token)) {
        emotionScores.set('anxious', (emotionScores.get('anxious') || 0) + 1);
      }
    });

    let maxEmotion: Emotion = 'neutral';
    let maxScore = 0;

    emotionScores.forEach((score, emotion) => {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    });

    return {
      emotion: maxEmotion,
      confidence: maxScore > 0 ? maxScore / tokens.length : 0.5
    };
  }

  private detectTopic(text: string): Topic | 'general' {
    const tokens = this.tokenize(text);
    const topicScores = new Map<Topic, number>();

    INTEREST_TOPICS.forEach(topic => {
      const score = tokens.filter(token => 
        token.includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(token)
      ).length;
      topicScores.set(topic, score);
    });

    let maxTopic: Topic | 'general' = 'general';
    let maxScore = 0;

    topicScores.forEach((score, topic) => {
      if (score > maxScore) {
        maxScore = score;
        maxTopic = topic;
      }
    });

    return maxTopic;
  }

  private getTopicResponses(topic: Topic | 'general'): string[] {
    const responses: Record<Topic | 'general', string[]> = {
      science: [
        "That's fascinating! What aspect of science interests you the most?",
        "Science is amazing! Have you read about any recent discoveries?",
        "I love discussing scientific topics! What's your take on this?"
      ],
      technology: [
        "Technology is evolving so fast! What's your thoughts on recent innovations?",
        "That's interesting! How do you think this technology will impact the future?",
        "I'm always excited to learn about new tech! Tell me more about your experience with it."
      ],
      nature: [
        "Nature is incredible! What aspects of the natural world fascinate you?",
        "I find nature so inspiring! Have you had any interesting encounters with wildlife?",
        "The natural world is full of wonders! What's your favorite natural phenomenon?"
      ],
      art: [
        "Art is such a powerful form of expression! What draws you to this piece?",
        "I'm fascinated by different art forms! What's your favorite style?",
        "Art has such a profound impact on culture! How does this piece make you feel?"
      ],
      music: [
        "Music has such a unique way of touching our souls! What genres do you enjoy?",
        "I'm always excited to learn about different musical styles! What draws you to this type?",
        "The world of music is so diverse! Have you discovered any new artists lately?"
      ],
      philosophy: [
        "That's a thought-provoking perspective! How did you come to this conclusion?",
        "Philosophy helps us understand life's big questions! What other philosophical ideas interest you?",
        "I find philosophical discussions fascinating! How do you think this relates to modern life?"
      ],
      space: [
        "Space is truly the final frontier! What aspects of space exploration excite you?",
        "The cosmos is full of mysteries! What's your take on recent space discoveries?",
        "Space never fails to amaze me! What do you think about the possibility of life elsewhere?"
      ],
      innovation: [
        "Innovation drives progress! What recent innovations have caught your attention?",
        "It's exciting to see new ideas come to life! How do you think this will change things?",
        "I'm always eager to learn about innovative solutions! What potential do you see in this?"
      ],
      general: [
        "That's interesting! Tell me more about your thoughts on this.",
        "I'd love to hear more about your perspective on this topic.",
        "What aspects of this interest you the most?"
      ]
    };

    return responses[topic];
  }

  private generateCuriousResponse(topic: Topic | 'general', emotion: Emotion): string {
    const responses = this.getTopicResponses(topic);
    const response = responses[Math.floor(Math.random() * responses.length)];
    const emotionalContext = emotion !== 'neutral' ? this.getEmotionalResponse(emotion) : '';
    return `${emotionalContext} ${response}`.trim();
  }

  private getEmotionalResponse(emotion: Emotion): string {
    const emotionalResponses: Record<Emotion, string[]> = {
      happy: [
        "I'm glad you're excited about this!",
        "Your enthusiasm is contagious!",
        "It's wonderful to see your positive energy!"
      ],
      sad: [
        "I understand this might be difficult.",
        "I appreciate you sharing your feelings.",
        "Let's explore this together."
      ],
      neutral: [""],
      excited: [
        "I can feel your excitement!",
        "Your enthusiasm is inspiring!",
        "It's great to see you so passionate!"
      ],
      anxious: [
        "I understand your concerns.",
        "Let's take our time with this.",
        "I'm here to help you process this."
      ],
      curious: [
        "I share your curiosity!",
        "It's great to explore this together!",
        "Let's discover more about this!"
      ]
    };

    const responses = emotionalResponses[emotion];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  public async generateResponse(userInput: string): Promise<string> {
    const { emotion } = this.detectEmotion(userInput);
    const topic = this.detectTopic(userInput);
    const response = this.generateCuriousResponse(topic, emotion);

    const conversation: Conversation = {
      input: userInput,
      response,
      emotion,
      topic,
      timestamp: new Date()
    };

    this.conversations.push(conversation);
    if (this.conversations.length > this.maxMemory) {
      this.conversations.shift();
    }

    // Save conversations and update learning
    this.storage.saveConversations(this.conversations);
    this.learning.learn([conversation]);

    return response;
  }

  public provideFeedback(positive: boolean): void {
    if (this.conversations.length > 0) {
      const lastConversation = this.conversations[this.conversations.length - 1];
      lastConversation.feedback = positive ? 'positive' : 'negative';
      this.storage.saveConversations(this.conversations);
      this.learning.learn([lastConversation]);
    }
  }

  public getStats() {
    return {
      personalityTraits: this.learning.getPersonalityTraits(),
      topicUnderstanding: this.learning.getTopicUnderstanding(),
      conversationCount: this.conversations.length,
      responsePatterns: this.learning.getResponsePatterns()
    };
  }
}