import { describe, expect, it } from "vitest";
import type { Challenge } from "./challenges.ts";
import { getSlot } from "./schedule.ts";

const make = (text: string, durationSec: number): Challenge => ({ text, durationSec, lottie: "ghost" });
const list = [make("a", 10), make("b", 20), make("c", 30)];

describe("getSlot", () => {
  it("starts the cycle at the epoch", () => {
    expect(getSlot(0, list)).toMatchObject({ index: 0, startsAt: 0, endsAt: 10_000 });
  });

  it("switches exactly at boundaries", () => {
    expect(getSlot(9_999, list).index).toBe(0);
    expect(getSlot(10_000, list).index).toBe(1);
    expect(getSlot(30_000, list)).toMatchObject({ index: 2, startsAt: 30_000, endsAt: 60_000 });
  });

  it("loops for real timestamps", () => {
    const now = Date.UTC(2026, 9, 31, 22, 13, 7);
    const slot = getSlot(now, list);
    expect(slot.startsAt).toBeLessThanOrEqual(now);
    expect(slot.endsAt).toBeGreaterThan(now);
    expect(getSlot(now + 60_000, list).index).toBe(slot.index);
  });

  it("rejects bad input", () => {
    expect(() => getSlot(0, [])).toThrow();
    expect(() => getSlot(0, [make("x", 0)])).toThrow();
  });
});
