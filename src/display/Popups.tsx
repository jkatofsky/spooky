import { AnimatePresence, motion } from "motion/react";
import { Lottie } from "../lib/Lottie.tsx";
import type { LottieName } from "../lotties.ts";

/** `x` is the distance in vw from the left edge, or from the right edge when `flip` is set. */
export type Popup = { id: string; lottie: LottieName; message: string; x: number; y: number; flip: boolean };

export function Popups({ items }: { items: Popup[] }) {
  return (
    <div className="popups" aria-hidden>
      <AnimatePresence>
        {items.map((p) => (
          <motion.div
            key={p.id}
            className={`popup ${p.flip ? "flip" : ""}`}
            style={{ [p.flip ? "right" : "left"]: `${p.x}vw`, top: `${p.y}vh` }}
            initial={{ transform: `translateY(0px) scale(0) rotate(${p.flip ? 25 : -25}deg)`, opacity: 0 }}
            animate={{ transform: "translateY(0px) scale(1) rotate(0deg)", opacity: 1 }}
            exit={{ transform: "translateY(-80px) scale(0.3) rotate(0deg)", opacity: 0, filter: "blur(12px)" }}
            transition={{ type: "spring", bounce: 0.55, duration: 0.8 }}
          >
            <Lottie name={p.lottie} className="popup-lottie" />
            {p.message && (
              <motion.p
                className="popup-bubble"
                initial={{ opacity: 0, transform: `translateX(${p.flip ? 30 : -30}px)` }}
                animate={{ opacity: 1, transform: "translateX(0px)" }}
                transition={{ delay: 0.25 }}
              >
                {p.message}
              </motion.p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
