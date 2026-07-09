export interface CreatureSummary {
  name: string;
  race: string;
  imageUrl: string;
}

export interface CreatureDetail extends CreatureSummary {
  description: string;
  hitpoints: number;
}
