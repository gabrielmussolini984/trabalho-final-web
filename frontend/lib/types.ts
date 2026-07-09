export type Difficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'lethal';

export interface BestiaryEntry {
  id: string;
  creatureName: string;
  difficulty: Difficulty;
  observedLoot: string;
  notes: string;
}

export interface CreatureSummary {
  name: string;
  race: string;
  imageUrl: string;
}
