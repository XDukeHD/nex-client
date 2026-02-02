"use client";

import { useState } from "react";
import {
  Settings,
  LogOut,
  RefreshCw,
  Wifi,
  WifiOff,
  LayoutGrid,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useNex } from "@/contexts/nex-context";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  hiddenWidgets: string[];
  onToggleWidget: (widgetId: string) => void;
  onResetLayout: () => void;
  editMode: boolean;
  onToggleEditMode: () => void;
}

const WIDGET_LABELS: Record<string, string> = {
  cpu: "CPU Usage",
  memory: "Memory",
  disk: "Disk Usage",
  network: "Network",
  uptime: "Uptime",
  wifi: "Wi-Fi",
  battery: "Battery",
  volume: "Volume",
  backlight: "Backlight",
  audio: "Audio Players",
};

export function DashboardHeader({
  hiddenWidgets,
  onToggleWidget,
  onResetLayout,
  editMode,
  onToggleEditMode,
}: DashboardHeaderProps) {
  const { isConnected, isConnecting, reconnect, logout } = useNex();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await reconnect();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 100 100">
              <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary"
              />
              <text
                x="50"
                y="58"
                textAnchor="middle"
                className="fill-foreground font-mono text-xl font-bold"
                style={{ fontSize: "24px" }}
              >
                N
              </text>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">NEX</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">
              System Monitor
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
            isConnected
              ? "bg-nex-success/10 text-nex-success"
              : isConnecting
              ? "bg-nex-warning/10 text-nex-warning"
              : "bg-destructive/10 text-destructive"
          )}>
            {isConnected ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">
              {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Disconnected"}
            </span>
          </div>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh connection"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>

          {/* Edit Mode Toggle */}
          <Button
            variant={editMode ? "default" : "ghost"}
            size="icon"
            className={cn("w-8 h-8", editMode && "bg-primary")}
            onClick={onToggleEditMode}
            aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8" aria-label="Settings">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass border-border/50">
              <DropdownMenuLabel>Widget Visibility</DropdownMenuLabel>
              {Object.entries(WIDGET_LABELS).map(([id, label]) => (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={!hiddenWidgets.includes(id)}
                  onCheckedChange={() => onToggleWidget(id)}
                >
                  {hiddenWidgets.includes(id) ? (
                    <EyeOff className="w-4 h-4 mr-2 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onResetLayout}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Layout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
