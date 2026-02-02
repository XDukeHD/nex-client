"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  getAuthToken,
  getBaseUrl,
  clearAuthToken,
  clearAllData,
} from "@/lib/nex-store";
import type { SystemStats, WebSocketTokenResponse } from "@/lib/nex-types";

interface NexContextType {
  stats: SystemStats | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  sendAudioCommand: (event: string, playerId: string) => void;
  reconnect: () => Promise<void>;
  disconnect: () => void;
  logout: () => void;
}

const NexContext = createContext<NexContextType | null>(null);

interface NexProviderProps {
  children: ReactNode;
  onLogout?: () => void;
}

export function NexProvider({ children, onLogout }: NexProviderProps) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Fetch WebSocket credentials from API
  const fetchWebSocketCredentials = useCallback(async (): Promise<WebSocketTokenResponse | null> => {
    const baseUrl = getBaseUrl();
    const authToken = getAuthToken();

    if (!baseUrl || !authToken) {
      return null;
    }

    try {
      const response = await fetch(`${baseUrl}/v1/websocket`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        toast.error("Session expired", { description: "Please log in again" });
        handleLogout();
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to get WebSocket credentials: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching WS credentials:", error);
      return null;
    }
  }, []);

  const handleLogout = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000);
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    clearAllData();
    setIsConnected(false);
    setStats(null);
    onLogout?.();
  }, [onLogout]);

  const connect = useCallback(async (silent = false) => {
    if (!mountedRef.current) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (!silent) {
      setIsConnecting(true);
      setConnectionError(null);
    }

    const credentials = await fetchWebSocketCredentials();
    if (!credentials) {
      setIsConnecting(false);
      setConnectionError("Failed to obtain connection credentials");
      return;
    }

    const { token: wsToken, socket: rawSocketUrl } = credentials.data;

    let socketUrl = rawSocketUrl;
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      socketUrl = socketUrl.replace("ws://", "wss://");
    }

    try {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      const ws = new WebSocket(socketUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        console.log("[v0] WebSocket connected, sending auth");
        
        ws.send(JSON.stringify({
          event: "auth",
          args: [wsToken],
        }));
        
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        
        if (!silent) {
          toast.success("Connected to NEX server");
        }
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        
        try {
          const message = JSON.parse(event.data);
          
          if (message.event === "stats" && message.args?.[0]) {
            const statsData = JSON.parse(message.args[0]) as SystemStats;
            setStats(statsData);
          } else if (message.event === "session expiring ") {
            // Note: event has trailing space per docs
            toast.info("Session refreshing", {
              description: "Maintaining connection...",
              duration: 3000,
            });
            // Trigger silent reconnect
            refreshSession();
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error);
        setConnectionError("Connection error occurred");
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        
        console.log("[v0] WebSocket closed:", event.code, event.reason);
        setIsConnected(false);

        switch (event.code) {
          case 1000:
          case 1001:
            // Normal closure
            break;
          case 4001:
            // Auth failed
            toast.error("Authentication failed", { description: "Please log in again" });
            handleLogout();
            break;
          case 4004:
            // Token expired - refresh
            toast.info("Session expired, reconnecting...");
            refreshSession();
            break;
          case 1006:
          default:
            // Abnormal closure - attempt reconnect
            if (mountedRef.current) {
              toast.error("Connection lost", { description: "Attempting to reconnect..." });
              reconnectTimeoutRef.current = setTimeout(() => {
                connect(true);
              }, 5000);
            }
            break;
        }
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      setIsConnecting(false);
      setConnectionError("Failed to establish connection");
    }
  }, [fetchWebSocketCredentials, handleLogout]);

  // Refresh session silently
  const refreshSession = useCallback(async () => {
    // Clear any existing refresh timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Slight delay to ensure smooth transition
    refreshTimeoutRef.current = setTimeout(async () => {
      await connect(true);
    }, 1000);
  }, [connect]);

  // Send audio control command
  const sendAudioCommand = useCallback((event: string, playerId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        event,
        args: [playerId],
      }));
    } else {
      toast.error("Not connected", { description: "Unable to send command" });
    }
  }, []);

  // Manual reconnect
  const reconnect = useCallback(async () => {
    await connect(false);
  }, [connect]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000);
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Logout
  const logout = useCallback(() => {
    handleLogout();
  }, [handleLogout]);

  // Connect on mount
  useEffect(() => {
    mountedRef.current = true;
    
    const authToken = getAuthToken();
    if (authToken) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      if (wsRef.current) {
        wsRef.current.close(1000);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [connect]);

  return (
    <NexContext.Provider
      value={{
        stats,
        isConnected,
        isConnecting,
        connectionError,
        sendAudioCommand,
        reconnect,
        disconnect,
        logout,
      }}
    >
      {children}
    </NexContext.Provider>
  );
}

export function useNex() {
  const context = useContext(NexContext);
  if (!context) {
    throw new Error("useNex must be used within a NexProvider");
  }
  return context;
}
