// NEX Type Definitions

export interface AudioPlayer {
  id: string;
  name: string;
  playing: boolean;
  artist?: string;
  title?: string;
  album?: string;
  art_url?: string;
  timestamp: number;
  duration: number;
}

export interface WifiStatus {
  ssid: string;
  connected: boolean;
}

export interface BatteryStatus {
  percentage: number;
  plugged_in: boolean;
}

export interface NetworkStats {
  rx_bytes: number;
  tx_bytes: number;
}

export interface SystemStats {
  memory_bytes: number;
  cpu_absolute: number;
  network: NetworkStats;
  uptime: number;
  disk_bytes: number;
  audio: AudioPlayer[];
  wifi: WifiStatus;
  battery: BatteryStatus;
  volume: number;
  backlight: number;
}

export interface WebSocketTokenResponse {
  object: "websocket_token";
  data: {
    token: string;
    socket: string;
  };
}

export interface LoginResponse {
  token: string;
}

export interface WebSocketMessage {
  event: string;
  args: string[];
}

export type WidgetType =
  | "cpu"
  | "memory"
  | "disk"
  | "network"
  | "uptime"
  | "wifi"
  | "battery"
  | "volume"
  | "backlight"
  | "audio";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  icon: string;
  defaultSize: { w: number; h: number };
  minSize?: { w: number; h: number };
}

export const DEFAULT_WIDGETS: Widget[] = [
  { id: "cpu", type: "cpu", title: "CPU Usage", icon: "Cpu", defaultSize: { w: 2, h: 1 } },
  { id: "memory", type: "memory", title: "Memory", icon: "MemoryStick", defaultSize: { w: 2, h: 1 } },
  { id: "disk", type: "disk", title: "Disk Usage", icon: "HardDrive", defaultSize: { w: 2, h: 1 } },
  { id: "network", type: "network", title: "Network", icon: "Network", defaultSize: { w: 2, h: 1 } },
  { id: "uptime", type: "uptime", title: "Uptime", icon: "Clock", defaultSize: { w: 1, h: 1 } },
  { id: "wifi", type: "wifi", title: "Wi-Fi", icon: "Wifi", defaultSize: { w: 1, h: 1 } },
  { id: "battery", type: "battery", title: "Battery", icon: "Battery", defaultSize: { w: 1, h: 1 } },
  { id: "volume", type: "volume", title: "Volume", icon: "Volume2", defaultSize: { w: 1, h: 1 } },
  { id: "backlight", type: "backlight", title: "Backlight", icon: "Sun", defaultSize: { w: 1, h: 1 } },
  { id: "audio", type: "audio", title: "Audio Players", icon: "Music", defaultSize: { w: 4, h: 2 }, minSize: { w: 2, h: 2 } },
];
