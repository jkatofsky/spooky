import type { LottieName } from "./lotties.ts";

export type Challenge = {
  text: string;
  durationSec: number;
  /** Shown above the challenge text, on guests' send button, and in reaction popups. */
  lottie: LottieName;
};

const minutesToSeconds = (minutes: number) => minutes * 60;

export const challenges: Challenge[] = [
  { text: "If someone responds to you saying \"trick or treat\" they have to drink!", durationSec: minutesToSeconds(10), lottie: "zombie-hand" },
  { text: "If your costume is from a movie, take a drink", durationSec: minutesToSeconds(5), lottie: "screaming-cauldron" },
  { text: "First person to present the undead baby head to one of the hosts will recieve a prize", durationSec: minutesToSeconds(10), lottie: "witch-flying" },
  { text: "If your last name is Woods take a drink", durationSec: minutesToSeconds(5), lottie: "ghost-lamp" },
  { text: "First person to present a worthy beverage to a host will recieve a prize", durationSec: minutesToSeconds(10), lottie: "death-dance" },
  { text: "Swap an item of your costume with someone else", durationSec: minutesToSeconds(10), lottie: "creepy-cat" },
  { text: "If your costume involves a hat, tip it out of respect at the beginning of every conversation. If you forget, drink.", durationSec: minutesToSeconds(10), lottie: "bloody-skull" },
  { text: "Guess what's in the spooky juice? Get it right and you just might get a treak", durationSec: minutesToSeconds(10), lottie: "potion" },
  { text: "Find a partner and twirl them around", durationSec: minutesToSeconds(10), lottie: "frankenstein" },
  { text: "Speak like your costume would speak. If you speak normally, drink", durationSec: 5, lottie: "jack-o-lantern" },
];
