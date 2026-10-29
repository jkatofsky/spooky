import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import type { ClientMessage, ServerMessage } from "../protocol.ts";

export function useSocket(role: "display" | "guest", onMessage: (msg: ServerMessage) => void) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const handleMessage = useEffectEvent(onMessage);

  useEffect(() => {
    let retry: ReturnType<typeof setTimeout>;
    let attempts = 0;
    let closed = false;

    const connect = () => {
      const proto = location.protocol === "https:" ? "wss" : "ws";
      const ws = new WebSocket(`${proto}://${location.host}/ws?role=${role}`);
      wsRef.current = ws;
      ws.onopen = () => {
        attempts = 0;
        setConnected(true);
      };
      ws.onmessage = (e) => handleMessage(JSON.parse(e.data));
      ws.onclose = () => {
        setConnected(false);
        if (!closed) retry = setTimeout(connect, Math.min(1000 * 2 ** attempts++, 8000));
      };
    };
    connect();

    return () => {
      closed = true;
      clearTimeout(retry);
      wsRef.current?.close();
    };
  }, [role]);

  const send = useCallback((msg: ClientMessage) => {
    const ws = wsRef.current;
    if (ws?.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(msg));
    return true;
  }, []);

  return { connected, send };
}
