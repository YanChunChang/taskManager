import { AnimatePresence, motion } from "framer-motion";
import type { FoodType } from "../types";
import { getFood } from "../utils";

type RewardBurstProps = {
  reward: { type: FoodType; amount: number } | null;
  foodNames: Record<FoodType, string>;
};

export function RewardBurst({ reward, foodNames }: RewardBurstProps) {
  const food = reward ? getFood(reward.type) : null;

  return (
    <AnimatePresence>
      {reward && food && (
        <motion.div
          className="reward-burst"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ pointerEvents: "none" }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.span
              key={index}
              initial={{ y: 18, x: 0, scale: 0.6, opacity: 0 }}
              animate={{
                y: -80 - index * 4,
                x: (index - 3.5) * 18,
                scale: [0.7, 1.2, 0.9],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1, delay: index * 0.04, ease: "easeOut" }}
            >
              {food.emoji}
            </motion.span>
          ))}
          <motion.div
            className="reward-toast"
            initial={{ y: 30, scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -12, scale: 0.96 }}
          >
            +{reward.amount} {foodNames[reward.type]}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
