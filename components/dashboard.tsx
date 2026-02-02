"use client";

import { useState, useCallback, useEffect } from "react";
import { useNex } from "@/contexts/nex-context";
import { DashboardHeader } from "./dashboard-header";
import { WidgetGrid } from "./widget-grid";
import { CpuWidget } from "./widgets/cpu-widget";
import { MemoryWidget } from "./widgets/memory-widget";
import { DiskWidget } from "./widgets/disk-widget";
import { NetworkWidget } from "./widgets/network-widget";
import { UptimeWidget } from "./widgets/uptime-widget";
import { WifiWidget } from "./widgets/wifi-widget";
import { BatteryWidget } from "./widgets/battery-widget";
import { VolumeWidget } from "./widgets/volume-widget";
import { BacklightWidget } from "./widgets/backlight-widget";
import { AudioPlayersWidget } from "./widgets/audio-player-widget";
import { AnimatedBackground } from "./animated-background";
import { getHiddenWidgets, saveHiddenWidgets, saveWidgetLayouts } from "@/lib/nex-store";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function Dashboard() {
  const { stats, isConnected, isConnecting } = useNex();
  const [hiddenWidgets, setHiddenWidgets] = useState<string[]>([]);
  const [widgetOrder, setWidgetOrder] = useState<string[]>([
    "cpu",
    "memory",
    "disk",
    "network",
    "uptime",
    "wifi",
    "battery",
    "volume",
    "backlight",
    "audio",
  ]);
  const [editMode, setEditMode] = useState(false);

  // Load hidden widgets from storage
  useEffect(() => {
    const stored = getHiddenWidgets();
    if (stored.length > 0) {
      setHiddenWidgets(stored);
    }
  }, []);

  const handleToggleWidget = useCallback((widgetId: string) => {
    setHiddenWidgets((prev) => {
      const newHidden = prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId];
      saveHiddenWidgets(newHidden);
      return newHidden;
    });
  }, []);

  const handleResetLayout = useCallback(() => {
    const defaultOrder = [
      "cpu",
      "memory",
      "disk",
      "network",
      "uptime",
      "wifi",
      "battery",
      "volume",
      "backlight",
      "audio",
    ];
    setWidgetOrder(defaultOrder);
    setHiddenWidgets([]);
    saveHiddenWidgets([]);
    saveWidgetLayouts(defaultOrder.map((id, index) => ({
      id,
      x: index % 4,
      y: Math.floor(index / 4),
      w: 1,
      h: 1,
      visible: true,
    })));
  }, []);

  const handleReorder = useCallback((newOrder: string[]) => {
    setWidgetOrder(newOrder);
  }, []);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    handleToggleWidget(widgetId);
  }, [handleToggleWidget]);

  // Build widgets array based on current stats
  const widgets = stats
    ? [
        { id: "cpu", component: <CpuWidget cpuUsage={stats.cpu_absolute} /> },
        { id: "memory", component: <MemoryWidget memoryBytes={stats.memory_bytes} /> },
        { id: "disk", component: <DiskWidget diskBytes={stats.disk_bytes} /> },
        { id: "network", component: <NetworkWidget network={stats.network} /> },
        { id: "uptime", component: <UptimeWidget uptime={stats.uptime} /> },
        { id: "wifi", component: <WifiWidget wifi={stats.wifi} /> },
        { id: "battery", component: <BatteryWidget battery={stats.battery} /> },
        { id: "volume", component: <VolumeWidget volume={stats.volume} /> },
        { id: "backlight", component: <BacklightWidget backlight={stats.backlight} /> },
        {
          id: "audio",
          component: <AudioPlayersWidget players={stats.audio} />,
        },
      ]
    : [];

  // Loading state
  if (!isConnected && isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Card className="glass border-border/50">
          <CardContent className="p-8 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Connecting to server...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Waiting for stats
  if (isConnected && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Card className="glass border-border/50">
          <CardContent className="p-8 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Waiting for system data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <DashboardHeader
        hiddenWidgets={hiddenWidgets}
        onToggleWidget={handleToggleWidget}
        onResetLayout={handleResetLayout}
        editMode={editMode}
        onToggleEditMode={() => setEditMode((prev) => !prev)}
      />
      
      <main className="pt-14 pb-8 nex-scrollbar overflow-auto h-screen">
        {stats ? (
          <WidgetGrid
            widgets={widgets}
            hiddenWidgets={hiddenWidgets}
            editMode={editMode}
            onReorder={handleReorder}
            onRemove={handleRemoveWidget}
          />
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Card className="glass border-border/50">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Not connected to server
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Edit mode indicator */}
      {editMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass border border-primary/50 text-sm text-primary">
          Edit Mode - Drag widgets to reorder, click X to hide
        </div>
      )}
    </div>
  );
}
