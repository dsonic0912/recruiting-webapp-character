export type Attributes = {
  Strength: number;
  Dexterity: number;
  Constitution: number;
  Intelligence: number;
  Wisdom: number;
  Charisma: number;
};

export type SkillPoints = {
  Acrobatics: number;
  "Animal Handling": number;
  Arcana: number;
  Athletics: number;
  Deception: number;
  History: number;
  Insight: number;
  Intimidation: number;
  Investigation: number;
  Medicine: number;
  Nature: number;
  Perception: number;
  Performance: number;
  Persuasion: number;
  Religion: number;
  "Sleight Of Hand": number;
  Stealth: number;
  Survival: number;
};

export type AttributeModifiers = {
  Strength: number;
  Dexterity: number;
  Constitution: number;
  Intelligence: number;
  Wisdom: number;
  Charisma: number;
};

export type Class = "Barbarian" | "Wizard" | "Bard";

export type Character = {
  name: string;
  selectedClass: string;
  attributes: Attributes;
  skillPoints: SkillPoints;
};
