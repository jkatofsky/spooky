// Shared with server/index.ts, so no DOM or Node APIs here.
export const COOLDOWN_MS = 1500;
export const POPUP_MS = 6000;
export const MAX_MESSAGE_LENGTH = 60;

export type ClientMessage = { type: "reaction"; message: string };

export type ServerMessage =
  | { type: "reaction"; id: string; message: string }
  | { type: "presence"; guests: number };
