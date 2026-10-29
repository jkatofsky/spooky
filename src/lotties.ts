// Free LottieFiles animations (Lottie Simple License), files in public/lottie/.
export const LOTTIES = {
  ghost: { by: "Margarita Maikova", url: "https://lottiefiles.com/free-animation/halloween-ghost-6wgIuz3BLS" },
  "ghost-lamp": { by: "Unknown", url: "https://lottiefiles.com/free-animation/ghost-halloween-JsubUIBFk2" },
  bat: { by: "MavicMikePT", url: "https://lottiefiles.com/free-animation/bat-flying-perfect-loop-animation-sqdBfvv5rM" },
  "jack-o-lantern": { by: "LottieFiles", url: "https://lottiefiles.com/free-animation/halloween-jack-o-lantern-r2Ozeis7Ns" },
  "flying-pumpkin": { by: "edi wasito", url: "https://lottiefiles.com/free-animation/cute-halloween-flying-pumpkin-vtSyrI9HMn" },
  "bloody-skull": { by: "Tania Hernandez Lima", url: "https://lottiefiles.com/free-animation/bloody-skull-kV88hbnrm7" },
  "witch-flying": { by: "Tam Doan", url: "https://lottiefiles.com/free-animation/halloween-cute-witch-flying-WvLzQGE6If" },
  "witch-broom": { by: "Tam Doan", url: "https://lottiefiles.com/free-animation/halloween-witch-and-broom-rWX27jwsKu" },
  cauldron: { by: "LottieFiles", url: "https://lottiefiles.com/free-animation/bubbling-pumpkin-cauldron-IhFpMpXfC4" },
  "screaming-cauldron": { by: "Tomer Arnon", url: "https://lottiefiles.com/free-animation/a-screaming-cauldron-RrLqjiLsYp" },
  potion: { by: "Margarita Maikova", url: "https://lottiefiles.com/free-animation/halloween-potion-u6q5Cr75wQ" },
  spider: { by: "edi wasito", url: "https://lottiefiles.com/free-animation/cute-halloween-spider-7MUImDIWqi" },
  "creepy-cat": { by: "Tomer Arnon", url: "https://lottiefiles.com/free-animation/creepy-cat-RBu6NwNFM5" },
  frankenstein: { by: "Shafiqah Hazarin", url: "https://lottiefiles.com/free-animation/frankenstein-bv7hrdoZ7B" },
  "zombie-hand": { by: "Margarita Maikova", url: "https://lottiefiles.com/free-animation/halloween-hand-GWxiFWlEhr" },
  "death-dance": { by: "jignesh gajjar", url: "https://lottiefiles.com/free-animation/death-dance-xrKmv0uJOR" },
} as const;

export type LottieName = keyof typeof LOTTIES;

export const lottieSrc = (name: LottieName) => `/lottie/${name}.lottie`;
