import { useEffect, useState, type CSSProperties } from "react";
import { Lottie } from "../lib/Lottie.tsx";

const EMBER_COLORS = ["#ff6a00", "#ff9a1f", "#ffcf5c", "#ff3d00", "#b388ff"];
const rand = (min: number, max: number) => min + Math.random() * (max - min);

// Each ember is one element running three compositor-only animations (`translate`,
// `transform`, `opacity`), so they cost nothing on the main thread.
const embers = Array.from({ length: 50 }, () => {
  const rise = rand(9, 26);
  return {
    left: `${rand(0, 100)}vw`,
    width: `${rand(3, 8)}px`,
    "--color": EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
    animationDuration: `${rise}s, ${rand(3, 7)}s, ${rand(1.5, 4)}s`,
    animationDelay: `${-rand(0, rise)}s, ${-rand(0, 7)}s, ${-rand(0, 4)}s`,
  } as CSSProperties;
});

function Embers() {
  return (
    <div className="embers">
      {embers.map((style, i) => (
        <div key={i} className="ember" style={style} />
      ))}
    </div>
  );
}

type Bat = { id: number; top: number; size: number; duration: number; ltr: boolean };

function Bats() {
  const [bats, setBats] = useState<Bat[]>([]);

  useEffect(() => {
    let id = 0;
    let timer: ReturnType<typeof setTimeout>;
    const spawn = () => {
      setBats((b) => [
        ...b.slice(-3),
        {
          id: id++,
          top: 5 + Math.random() * 45,
          size: 90 + Math.random() * 120,
          duration: 9 + Math.random() * 8,
          ltr: Math.random() > 0.5,
        },
      ]);
      timer = setTimeout(spawn, 5000 + Math.random() * 9000);
    };
    timer = setTimeout(spawn, 1500);
    return () => clearTimeout(timer);
  }, []);

  return bats.map((b) => (
    <div
      key={b.id}
      className={`bat ${b.ltr ? "ltr" : "rtl"}`}
      style={{ top: `${b.top}vh`, width: b.size, height: b.size, animationDuration: `${b.duration}s` }}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setBats((all) => all.filter((x) => x.id !== b.id));
      }}
    >
      <div className="bat-bob" style={{ animationDuration: `${b.duration}s` }}>
        <Lottie name="bat" speed={1.4} />
      </div>
    </div>
  ));
}

function Graveyard() {
  return (
    <svg className="graveyard" viewBox="0 0 1600 220" preserveAspectRatio="none" aria-hidden>
      <path
        d="M0 220 V150 Q200 110 420 140 T860 130 T1300 145 T1600 125 V220 Z"
        fill="#07030c"
      />
      <path d="M180 150 v-55 a35 35 0 0 1 70 0 v55 z M520 140 v-40 a28 28 0 0 1 56 0 v40 z M1180 145 v-60 a38 38 0 0 1 76 0 v60 z M1420 135 v-35 h12 v-14 h12 v14 h12 v35 z M760 132 v-22 h10 v-18 h8 v18 h10 v22 z" fill="#07030c" />
      <path
        d="M980 140 C985 90 975 60 990 10 M988 60 C1010 40 1030 42 1050 20 M985 85 C960 70 945 60 930 35 M992 35 C1000 20 1015 12 1022 0"
        stroke="#07030c"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Background() {
  return (
    <div className="bg" aria-hidden>
      <div className="sky" />
      <div className="moon-glow" />
      <div className="moon" />
      <Embers />
      <Bats />
      <div className="fog fog-back" />
      <Graveyard />
      <div className="fog fog-front" />
      <div className="spider">
        <div className="spider-thread" />
        <div className="spider-hang">
          <Lottie name="spider" />
        </div>
      </div>
      <div className="vignette" />
      <div className="flicker" />
    </div>
  );
}
