import { AnimatePresence, motion, type Variants } from "motion/react";
import { useRef } from "react";
import { Lottie, type LottiePlayer } from "../lib/Lottie.tsx";
import type { Slot } from "../schedule.ts";

// Motion only hands `transform` (as a full string), `opacity` and `filter` to the
// compositor. Shorthands like `x`/`scale`/`rotate` run in JS on every frame.

const card: Variants = {
  hidden: { opacity: 0, transform: "translateY(0px) scale(1)" },
  shown: {
    opacity: 1,
    transform: "translateY(0px) scale(1)",
    transition: { staggerChildren: 0.07, delayChildren: 0.35 },
  },
  gone: {
    opacity: 0,
    transform: "translateY(-60px) scale(1.25)",
    filter: "blur(24px)",
    transition: { duration: 0.7, ease: "easeIn" },
  },
};

const lottie: Variants = {
  hidden: { opacity: 0, transform: "scale(0.2) rotate(-25deg)" },
  shown: {
    opacity: 1,
    transform: "scale(1) rotate(0deg)",
    transition: { type: "spring", bounce: 0.55, duration: 1.1 },
  },
};

const word: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    transform: `translateY(60px) rotate(${i % 2 ? 12 : -12}deg)`,
    filter: "blur(12px)",
  }),
  shown: {
    opacity: 1,
    transform: "translateY(0px) rotate(0deg)",
    filter: "blur(0px)",
    transition: {
      transform: { type: "spring", bounce: 0.5, duration: 0.9 },
      default: { duration: 0.5 },
    },
    // A lingering blur(0px) still makes the browser render each word through a filter pass.
    transitionEnd: { filter: "none" },
  },
};

export function ChallengeCard({ slot }: { slot: Slot }) {
  const { challenge, startsAt } = slot;
  // The canvas is sized from its on-screen box, which is tiny mid-spring and
  // never re-measured on transform changes, so re-measure once it settles.
  const player = useRef<LottiePlayer | null>(null);
  const len = challenge.text.length;
  const size = len > 70 ? "sm" : len > 36 ? "md" : "lg";

  return (
    <AnimatePresence mode="wait">
      <motion.section key={startsAt} className="card" variants={card} initial="hidden" animate="shown" exit="gone">
        <motion.div className="card-lottie" variants={lottie} onAnimationComplete={() => void player.current?.resize()}>
          <div className="bob">
            <Lottie name={challenge.lottie} playerRef={(p) => (player.current = p)} />
          </div>
        </motion.div>
        <h1 className={`card-text ${size}`}>
          {challenge.text.split(/\s+/).map((w, i) => (
            <motion.span key={i} className="word glow" data-text={w} custom={i} variants={word}>
              {w}
            </motion.span>
          ))}
        </h1>
      </motion.section>
    </AnimatePresence>
  );
}
