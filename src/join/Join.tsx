import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNow, useSlot } from "../hooks/useClock.ts";
import { useSocket } from "../hooks/useSocket.ts";
import { formatDuration } from "../lib/format.ts";
import { Lottie } from "../lib/Lottie.tsx";
import { COOLDOWN_MS, MAX_MESSAGE_LENGTH } from "../protocol.ts";

export default function Join() {
  const slot = useSlot();
  const now = useNow(1000);
  const [message, setMessage] = useState("");
  const [cooling, setCooling] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [guests, setGuests] = useState(0);
  const { connected, send } = useSocket("guest", (msg) => {
    if (msg.type === "presence") setGuests(msg.guests);
  });

  const fire = () => {
    if (cooling || !send({ type: "reaction", message: message.trim() })) return;
    navigator.vibrate?.(30);
    setSentAt(Date.now());
    setMessage("");
    setCooling(true);
    setTimeout(() => setCooling(false), COOLDOWN_MS);
  };

  return (
    <div className="join">
      <header className="join-header">
        <h1 className="glow" data-text="Haunt the Screen">
          Haunt the Screen
        </h1>
        <p className={`join-status ${connected ? "on" : ""}`}>
          {connected ? `${guests} ${guests === 1 ? "ghoul" : "ghouls"} lurking` : "Summoning connection…"}
        </p>
      </header>

      <section className="join-now">
        <span className="join-now-label">Current challenge</span>
        <p className="join-now-text">{slot.challenge.text}</p>
        <span className="join-now-time">Next in {formatDuration(slot.endsAt - now)}</span>
      </section>

      <form
        className="join-form"
        onSubmit={(e) => {
          e.preventDefault();
          fire();
        }}
      >
        <input
          value={message}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Message (optional)"
          enterKeyHint="send"
          onChange={(e) => setMessage(e.target.value)}
        />
        <motion.button type="submit" className="join-btn" disabled={!connected || cooling} whileTap={{ scale: 0.9 }}>
          <Lottie name={slot.challenge.lottie} className="join-btn-lottie" />
          <span>Tap 2 spook</span>
        </motion.button>
      </form>

      <AnimatePresence>
        {sentAt && (
          <motion.p
            key={sentAt}
            className="join-sent"
            initial={{ transform: "translateY(20px)", opacity: 0 }}
            animate={{ transform: "translateY(0px)", opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setTimeout(() => setSentAt((t) => (t === sentAt ? null : t)), 1200)}
          >
            Spook sent
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
