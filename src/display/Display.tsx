import { motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSlot } from "../hooks/useClock.ts";
import { useSocket } from "../hooks/useSocket.ts";
import { POPUP_MS } from "../protocol.ts";
import { Background } from "./Background.tsx";
import { ChallengeCard } from "./ChallengeCard.tsx";
import { Countdown } from "./Countdown.tsx";
import { JoinQr } from "./JoinQr.tsx";
import { Popups, type Popup } from "./Popups.tsx";

const MAX_POPUPS = 8;

function useWakeLock() {
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    const acquire = () => {
      if (document.visibilityState !== "visible") return;
      navigator.wakeLock.request("screen").then((l) => (lock = l), () => {});
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      document.removeEventListener("visibilitychange", acquire);
      void lock?.release();
    };
  }, []);
}

export default function Display() {
  const slot = useSlot();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [guests, setGuests] = useState(0);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [firstSlotStart] = useState(slot.startsAt);
  const isFirstSlot = slot.startsAt === firstSlotStart;

  useWakeLock();

  useEffect(() => {
    if (isFirstSlot) return;
    const shake = [[0, 0], [-18, 6], [16, -8], [-12, 5], [10, -3], [-5, 2], [0, 0]];
    void animate(scope.current, { transform: shake.map(([x, y]) => `translate(${x}px, ${y}px)`) }, { duration: 0.55 });
  }, [isFirstSlot, slot.startsAt, animate, scope]);

  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useSocket("display", (msg) => {
    if (msg.type === "presence") return setGuests(msg.guests);
    const flip = Math.random() > 0.5;
    const popup: Popup = {
      id: msg.id,
      lottie: slot.challenge.lottie,
      message: msg.message,
      flip,
      x: 2 + Math.random() * 14,
      y: 28 + Math.random() * 35,
    };
    setPopups((all) => [...all.slice(-(MAX_POPUPS - 1)), popup]);
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setPopups((all) => all.filter((p) => p.id !== popup.id));
    }, POPUP_MS);
    timers.current.add(timer);
  });

  return (
    <div className="display">
      <div ref={scope} className="shake-root">
        <Background />
        <main className="stage">
          <ChallengeCard slot={slot} />
        </main>
        <Countdown slot={slot} />
        <JoinQr guests={guests} />
        <Popups items={popups} />
      </div>

      {!isFirstSlot && (
        <motion.div
          key={slot.startsAt}
          className="flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0.1, 0.6, 0] }}
          transition={{ duration: 0.9, times: [0, 0.1, 0.25, 0.4, 1] }}
        />
      )}
    </div>
  );
}
