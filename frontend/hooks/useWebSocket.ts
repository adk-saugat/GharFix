import { useEffect, useRef, useState, useCallback } from "react";
import { getToken } from "@/api/storage";
import type { Message } from "@/api/types";

function getWsUrl(): string {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
  return base.replace(/^http/, "ws");
}

export function useWebSocket(
  jobId: string | undefined,
  onMessage: (msg: Message) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!jobId) return;

    let closed = false;

    async function connect() {
      const token = await getToken();
      if (!token || closed) return;

      const url = `${getWsUrl()}/ws?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(url);

      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => {
        setIsConnected(false);
        if (!closed) setTimeout(connect, 3000);
      };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as Message;
          if (msg.id && msg.content) onMessageRef.current(msg);
        } catch (_) {}
      };
      ws.onerror = () => {};

      wsRef.current = ws;
    }

    connect();
    return () => {
      closed = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [jobId]);

  return { isConnected };
}
