import { useEffect, useState } from "react";
import { challenges } from "../challenges.ts";
import { getSlot, type Slot } from "../schedule.ts";

/** Ticks on wall-clock multiples of `intervalMs`, so second-based countdowns flip exactly on time. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      timer = setTimeout(tick, intervalMs - (t % intervalMs));
    };
    timer = setTimeout(tick, intervalMs - (Date.now() % intervalMs));
    return () => clearTimeout(timer);
  }, [intervalMs]);
  return now;
}

/** Re-renders only when the active challenge changes, not on every tick. */
export function useSlot(): Slot {
  const [slot, setSlot] = useState(() => getSlot(Date.now(), challenges));
  useEffect(() => {
    const timer = setTimeout(() => setSlot(getSlot(Date.now(), challenges)), Math.max(0, slot.endsAt - Date.now()));
    return () => clearTimeout(timer);
  }, [slot]);
  return slot;
}
