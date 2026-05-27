import { foods } from "./data";
import type { FoodType, Mood, Task } from "./types";

export const getFood = (id: FoodType) => foods.find((food) => food.id === id)!;

export const totalInventory = (inventory: Record<FoodType, number>) =>
  Object.values(inventory).reduce((sum, count) => sum + count, 0);

export const completedCount = (tasks: Task[]) => tasks.filter((task) => task.completed).length;

export const levelFromTasks = (count: number) => Math.max(1, Math.floor(count / 3) + 1);

export const progressToNextLevel = (count: number) => ((count % 3) / 3) * 100;

export const determineMood = (hunger: number, happiness: number, feedCombo: number): Mood => {
  if (feedCombo >= 3) return "excited";
  if (hunger < 25 || happiness < 25) return "sad";
  if (hunger > 76 && happiness > 72) return "sleeping";
  return "happy";
};
