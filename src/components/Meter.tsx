import { motion } from "framer-motion";

type MeterProps = {
  label: string;
  value: number;
  tone: "violet" | "pink" | "gold";
};

export function Meter({ label, value, tone }: MeterProps) {
  return (
    <div className="meter">
      <div className="meter-label">
        <span>{label}</span>
        <strong>{Math.round(value)}%</strong>
      </div>
      <div className="meter-track">
        <motion.div
          className={`meter-fill ${tone}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  );
}
