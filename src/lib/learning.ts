import { Conversation, Topic, Emotion, PersonalityTrait } from './types';

export class LearningSystem {
  private personalityTraits: Map<string, PersonalityTrait>;
  private topicUnderstanding: Map<Topic | 'general', number>;
  private responsePatterns: Map<string, number>;

  constructor() {
    this.personalityTraits = new Map([
      ['curiosity', { value: 0.8, growth: 0 }],
      ['empathy', { value: 0.7, growth: 0 }],
      ['enthusiasm', { value: 0.6, growth: 0 }],
      ['knowledge', { value: 0.9, growth: 0 }]
    ]);

    this.topicUnderstanding = new Map();
    this.responsePatterns = new Map();
  }

  learn(conversations: Conversation[]): void {
    conversations.forEach(conv => {
      this.updateTopicUnderstanding(conv);
      this.updateResponsePatterns(conv);
      this.updatePersonalityTraits(conv);
    });
  }

  private updateTopicUnderstanding(conversation: Conversation): void {
    const currentValue = this.topicUnderstanding.get(conversation.topic) || 0;
    const increment = conversation.feedback === 'positive' ? 0.1 : -0.05;
    this.topicUnderstanding.set(
      conversation.topic,
      Math.min(Math.max(currentValue + increment, 0), 1)
    );
  }

  private updateResponsePatterns(conversation: Conversation): void {
    const pattern = this.extractPattern(conversation.input);
    const currentValue = this.responsePatterns.get(pattern) || 0;
    const increment = conversation.feedback === 'positive' ? 1 : -0.5;
    this.responsePatterns.set(pattern, currentValue + increment);
  }

  private updatePersonalityTraits(conversation: Conversation): void {
    if (conversation.feedback === 'positive') {
      this.personalityTraits.forEach((trait, name) => {
        const growth = this.calculateTraitGrowth(name, conversation);
        trait.value = Math.min(Math.max(trait.value + growth, 0), 1);
        trait.growth += growth;
      });
    }
  }

  private calculateTraitGrowth(traitName: string, conversation: Conversation): number {
    const baseGrowth = 0.01;
    switch (traitName) {
      case 'curiosity':
        return conversation.input.includes('?') ? baseGrowth * 2 : baseGrowth;
      case 'empathy':
        return conversation.emotion !== 'neutral' ? baseGrowth * 1.5 : baseGrowth;
      case 'enthusiasm':
        return conversation.emotion === 'excited' ? baseGrowth * 2 : baseGrowth;
      case 'knowledge':
        return this.topicUnderstanding.get(conversation.topic) || baseGrowth;
      default:
        return baseGrowth;
    }
  }

  private extractPattern(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .slice(0, 3)
      .join(' ');
  }

  getPersonalityTraits(): Map<string, PersonalityTrait> {
    return new Map(this.personalityTraits);
  }

  getTopicUnderstanding(): Map<Topic | 'general', number> {
    return new Map(this.topicUnderstanding);
  }

  getResponsePatterns(): Map<string, number> {
    return new Map(this.responsePatterns);
  }
}