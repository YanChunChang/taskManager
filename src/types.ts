import type { LucideIcon } from "lucide-react";

export type Screen = "home" | "tasks" | "pet" | "inventory" | "stats" | "settings";

export type FoodType = "berries" | "seeds" | "carrots" | "snacks";

export type Mood = "happy" | "sad" | "excited" | "sleeping";

export type Task = {
  id: string;
  title: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
  deadline?: string;
  completed: boolean;
  reward: {
    type: FoodType;
    amount: number;
  };
};

export type Food = {
  id: FoodType;
  name: string;
  emoji: string;
  color: string;
  hunger: number;
  happiness: number;
  energy: number;
  unlockLevel: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: LucideIcon;
};
