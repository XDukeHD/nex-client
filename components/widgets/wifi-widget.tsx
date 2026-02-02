"use client";

import { Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WifiStatus } from "@/lib/nex-types";

interface WifiWidgetProps {
  wifi: WifiStatus;
}

export function WifiWidget({ wifi }: WifiWidgetProps) {
  return (
    <Card className="glass border-border/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Wi-Fi
        </CardTitle>
        <div className={`p-2 rounded-lg ${wifi.connected ? "bg-nex-success/10" : "bg-destructive/10"}`}>
          {wifi.connected ? (
            <Wifi className="w-4 h-4 text-nex-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-1">
          <span className={`text-lg font-semibold truncate ${wifi.connected ? "text-foreground" : "text-muted-foreground"}`}>
            {wifi.connected ? wifi.ssid : "Disconnected"}
          </span>
          <span className={`text-xs ${wifi.connected ? "text-nex-success" : "text-destructive"}`}>
            {wifi.connected ? "Connected" : "No network"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
