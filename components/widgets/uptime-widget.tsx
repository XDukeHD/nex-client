"use client";

import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUptime, formatUptimeLong } from "@/lib/format-utils";

interface UptimeWidgetProps {
  uptime: number;
}

export function UptimeWidget({ uptime }: UptimeWidgetProps) {
  return (
    <Card className="glass border-border/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Uptime
        </CardTitle>
        <div className="p-2 rounded-lg bg-nex-success/10">
          <Clock className="w-4 h-4 text-nex-success" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold font-mono text-nex-success">
            {formatUptime(uptime)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatUptimeLong(uptime)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
