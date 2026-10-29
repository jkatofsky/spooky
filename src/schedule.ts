import type { Challenge } from "./challenges.ts";

export type Slot = {
  challenge: Challenge;
  index: number;
  /** Unix ms (UTC) when this challenge became active. */
  startsAt: number;
  /** Unix ms (UTC) when the next challenge takes over. */
  endsAt: number;
};

const toMs = (sec: number) => Math.round(sec * 1000);

/**
 * The list repeats back-to-back starting at the Unix epoch, so any device with a
 * correct clock computes the same active challenge for the same instant.
 */
export function getSlot(nowMs: number, list: readonly Challenge[]): Slot {
  if (list.length === 0) throw new Error("challenges list is empty");
  for (const c of list) {
    if (!(c.durationSec > 0)) throw new Error(`durationSec must be > 0: "${c.text}"`);
  }

  const cycleMs = list.reduce((sum, c) => sum + toMs(c.durationSec), 0);
  const intoCycle = ((nowMs % cycleMs) + cycleMs) % cycleMs;

  let startsAt = nowMs - intoCycle;
  for (let index = 0; index < list.length; index++) {
    const endsAt = startsAt + toMs(list[index].durationSec);
    if (nowMs < endsAt) return { challenge: list[index], index, startsAt, endsAt };
    startsAt = endsAt;
  }
  throw new Error("unreachable");
}
