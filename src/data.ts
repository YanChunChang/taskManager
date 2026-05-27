import { Flame, Gift, Medal, Sparkles } from "lucide-react";
import type { Achievement, Food, Task } from "./types";

export const foods: Food[] = [
  {
    id: "berries",
    name: "Moon Berries",
    emoji: "🫐",
    color: "#b794f6",
    hunger: 1,
    happiness: 1,
    energy: 2,
    unlockLevel: 1,
  },
  {
    id: "seeds",
    name: "Cloud Seeds",
    emoji: "🌰",
    color: "#c4b5fd",
    hunger: 2,
    happiness: 1,
    energy: 1,
    unlockLevel: 1,
  },
  {
    id: "carrots",
    name: "Tiny Carrots",
    emoji: "🥕",
    color: "#f6ad55",
    hunger: 3,
    happiness: 0,
    energy: 1,
    unlockLevel: 2,
  },
  {
    id: "snacks",
    name: "Star Snacks",
    emoji: "⭐",
    color: "#fbbf24",
    hunger: 1,
    happiness: 3,
    energy: 1,
    unlockLevel: 3,
  },
];

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Plan the top three priorities",
    titleKey: "task-1",
    description: "Choose the most meaningful tasks for today.",
    descriptionKey: "task-1",
    deadline: new Date().toISOString().slice(0, 10),
    completed: false,
    reward: { type: "berries", amount: 2 },
  },
  {
    id: "task-2",
    title: "Deep work sprint",
    titleKey: "task-2",
    description: "A calm 30-minute focus block.",
    descriptionKey: "task-2",
    completed: false,
    reward: { type: "seeds", amount: 3 },
  },
  {
    id: "task-3",
    title: "Reset desk and refill water",
    titleKey: "task-3",
    completed: true,
    reward: { type: "berries", amount: 1 },
  },
];

export const quotes = [
  "Small steps still feed big dreams.",
  "Your chinchilla believes in gentle momentum.",
  "Finish one thing. Make the room a little brighter.",
  "Progress can be soft and still be powerful.",
];

export const baseAchievements: Achievement[] = [
  {
    id: "first-treat",
    title: "First Treat",
    description: "Complete one task and earn your first food reward.",
    unlocked: true,
    icon: Gift,
  },
  {
    id: "cozy-streak",
    title: "Cozy Streak",
    description: "Keep a daily rhythm for three days.",
    unlocked: true,
    icon: Flame,
  },
  {
    id: "happy-habitat",
    title: "Happy Habitat",
    description: "Reach level 3 to unlock the lavender den.",
    unlocked: false,
    icon: Sparkles,
  },
  {
    id: "chinchilla-champion",
    title: "Chinchilla Champion",
    description: "Complete 25 tasks across your journey.",
    unlocked: false,
    icon: Medal,
  },
];
