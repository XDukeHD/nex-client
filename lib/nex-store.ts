const STORAGE_KEYS = {
  CONNECTION: "nex-connection",
  AUTH_TOKEN: "nex-auth-token",
  WIDGET_LAYOUT: "nex-widget-layout",
  HIDDEN_WIDGETS: "nex-hidden-widgets",
} as const;

export interface ConnectionConfig {
  ip: string;
  port: number;
}

export interface WidgetLayout {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  visible: boolean;
}

export function getConnectionConfig(): ConnectionConfig | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.CONNECTION);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveConnectionConfig(config: ConnectionConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CONNECTION, JSON.stringify(config));
}

export function clearConnectionConfig(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CONNECTION);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function saveAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function getWidgetLayouts(): WidgetLayout[] | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.WIDGET_LAYOUT);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveWidgetLayouts(layouts: WidgetLayout[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.WIDGET_LAYOUT, JSON.stringify(layouts));
}

// Hidden widgets
export function getHiddenWidgets(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.HIDDEN_WIDGETS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveHiddenWidgets(widgetIds: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.HIDDEN_WIDGETS, JSON.stringify(widgetIds));
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

// API helpers
export function getBaseUrl(): string | null {
  const config = getConnectionConfig();
  if (!config) return null;
  return `http://${config.ip}:${config.port}`;
}
