import { AnimatePresence, motion } from "framer-motion";
import type { Mood } from "../types";

type ChinchillaProps = {
  mood: Mood;
  level: number;
  color?: "silver" | "cream" | "cocoa" | "blue";
  compact?: boolean;
  feeding?: boolean;
  petting?: boolean;
  interactionKey?: number;
  onPet?: () => void;
  interactionLabel?: string;
};

const moodFace = {
  happy: { mouth: "ᴗ", label: "content" },
  sad: { mouth: "︵", label: "hungry" },
  excited: { mouth: "ᴗ", label: "sparkly" },
  sleeping: { mouth: "ᴗ", label: "sleepy" },
};

export function Chinchilla({
  mood,
  level,
  color = "silver",
  compact = false,
  feeding = false,
  petting = false,
  interactionKey = 0,
  onPet,
  interactionLabel,
}: ChinchillaProps) {
  const face = moodFace[mood];
  const isReacting = feeding || petting;
  const roam = compact
    ? {
        x: 0,
        y: mood === "excited" ? [0, -8, 0, -5, 0] : mood === "sleeping" ? [0, 2, 0] : [0, -3, 0],
        duration: mood === "excited" ? 1.2 : 2.8,
      }
    : {
        x:
          mood === "sleeping"
            ? [0, 6, 0]
            : mood === "sad"
              ? [0, -18, 12, -8, 0]
              : mood === "excited"
                ? [0, -52, 48, -34, 38, 0]
                : [0, -42, 34, 48, -26, 0],
        y:
          mood === "sleeping"
            ? [0, 2, 0]
            : mood === "sad"
              ? [0, 7, 2, 8, 0]
              : mood === "excited"
                ? [0, -12, 8, -10, 6, 0]
                : [0, -6, 10, -4, 8, 0],
        duration: mood === "excited" ? 5.2 : mood === "sad" ? 9.5 : mood === "sleeping" ? 4.5 : 8,
      };

  return (
    <motion.div
      className={`chinchilla-wrap mood-${mood} fur-${color} ${compact ? "compact" : ""}`}
      role={onPet ? "button" : undefined}
      tabIndex={onPet ? 0 : undefined}
      onClick={onPet}
      onKeyDown={(event) => {
        if (!onPet) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPet();
        }
      }}
      animate={{
        x: isReacting ? 0 : roam.x,
        y: isReacting ? [0, -8, 0] : roam.y,
        rotate: feeding ? [0, -3, 3, 0] : petting ? [0, -5, 5, 0] : mood === "excited" && !compact ? [0, -4, 4, -3, 3, 0] : 0,
      }}
      transition={{ duration: isReacting ? 0.75 : roam.duration, repeat: Infinity, ease: "easeInOut" }}
      aria-label={interactionLabel ?? `Level ${level} chinchilla is ${face.label}`}
    >
      <motion.img
        className="chinchilla-image"
        src="/assets/chinchilla-mascot.png"
        alt=""
        draggable={false}
        animate={{ scale: feeding ? [1, 1.07, 1] : petting ? [1, 1.1, 0.98, 1] : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <AnimatePresence>
        {interactionKey > 0 && (
          <motion.div className="petting-burst" key={interactionKey} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {["♡", "✦", "♡", "✧", "♡"].map((symbol, index) => (
              <motion.span
                key={`${symbol}-${index}`}
                initial={{ opacity: 0, scale: 0.5, x: 0, y: 8 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.55, 1.12, 0.92],
                  x: (index - 2) * 18,
                  y: -48 - index * 4,
                }}
                transition={{ duration: 0.95, delay: index * 0.04, ease: "easeOut" }}
              >
                {symbol}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`accessory level-${Math.min(level, 4)}`}>
        {level >= 4 ? "✦" : level >= 3 ? "✿" : level >= 2 ? "♡" : ""}
      </div>
      {mood === "sleeping" && (
        <motion.div
          className="sleep-bubble"
          animate={{ y: [-4, -18], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
        >
          z
        </motion.div>
      )}
      {feeding && <motion.div className="nom" initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}>nom</motion.div>}
    </motion.div>
  );
}
