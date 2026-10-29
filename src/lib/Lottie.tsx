import { DotLottieWorkerReact, setWasmUrl, type DotLottieWorker } from "@lottiefiles/dotlottie-react";
import wasmUrl from "@lottiefiles/dotlottie-web/dotlottie-player.wasm?url";
import type { CSSProperties } from "react";
import { lottieSrc, type LottieName } from "../lotties.ts";

// Serve the player from our own build instead of a CDN, so it works offline.
setWasmUrl(wasmUrl);

export type LottiePlayer = DotLottieWorker;

// Rendering happens in a shared worker on an OffscreenCanvas, so the main thread
// stays free. Capping DPR shrinks every canvas, and with it the per-frame raster
// work and GPU memory; these are soft cartoons, so it's not noticeable.
const renderConfig = {
  autoResize: true,
  freezeOnOffscreen: true,
  devicePixelRatio: Math.min(window.devicePixelRatio, 1.5),
};

type Props = {
  name: LottieName;
  className?: string;
  style?: CSSProperties;
  speed?: number;
  playerRef?: (player: LottiePlayer | null) => void;
};

export function Lottie({ name, className, style, speed = 1, playerRef }: Props) {
  return (
    <DotLottieWorkerReact
      key={name}
      src={lottieSrc(name)}
      autoplay
      loop
      speed={speed}
      className={className}
      style={style}
      renderConfig={renderConfig}
      dotLottieRefCallback={playerRef}
    />
  );
}
