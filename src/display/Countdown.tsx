import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNow } from "../hooks/useClock.ts";
import { formatDuration } from "../lib/format.ts";
import type { Slot } from "../schedule.ts";

const URGENT_SEC = 10;
const FINAL_SEC = 5;

/** A CSS animation, offset by the time already elapsed, so it runs entirely on the compositor. */
function Candle({ slot }: { slot: Slot }) {
  const [style] = useState(() => ({
    animationDuration: `${slot.endsAt - slot.startsAt}ms`,
    animationDelay: `${slot.startsAt - Date.now()}ms`,
  }));
  return <div className="candle-fill" style={style} />;
}

export function Countdown({ slot }: { slot: Slot }) {
  const now = useNow(1000);
  const remaining = Math.max(0, slot.endsAt - now);
  const secs = Math.ceil(remaining / 1000);
  const urgent = secs <= URGENT_SEC;

  return (
    <>
      <footer className={`countdown ${urgent ? "urgent" : ""}`}>
        <span className="countdown-label">Next challenge in</span>
        <span className="countdown-time">{formatDuration(remaining)}</span>
        <div className="candle">
          <Candle key={slot.startsAt} slot={slot} />
        </div>
      </footer>

      <AnimatePresence>
        {secs <= FINAL_SEC && secs > 0 && (
          <motion.div
            key={secs}
            className="final-count"
            initial={{ transform: "scale(2.4) rotate(-10deg)", opacity: 0 }}
            animate={{ transform: "scale(1) rotate(0deg)", opacity: 0.85 }}
            exit={{ transform: "scale(0.6) rotate(0deg)", opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          >
            {secs}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
