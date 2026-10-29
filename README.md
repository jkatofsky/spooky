# Halloween Party Challenges

A TV screen that cycles through party challenges, with a live countdown and a QR code that lets guests pop animations onto the screen.

```sh
npm install
npm start        # builds, then serves on http://localhost:8080
```

Open `http://localhost:8080` on the laptop and AirPlay the screen to the TV. Guests on the same Wi-Fi scan the QR code in the corner.

- Edit challenges in `src/challenges.ts`. The list loops based on UTC time, so every screen shows the same challenge.
- Lottie animations live in `public/lottie/` and are registered in `src/lotties.ts`.
- `PORT=3000 npm start` changes the port. `HOST_IP=192.168.1.20 npm start` overrides the IP in the QR code if it picks the wrong network.
- To let guests join off the Wi-Fi, run `cloudflared tunnel --url http://localhost:8080` and start with `JOIN_URL=https://<printed-name>.trycloudflare.com npm start`. The tunnel URL changes every time `cloudflared` restarts.
- Run `caffeinate -d` in another terminal to keep the Mac awake.
