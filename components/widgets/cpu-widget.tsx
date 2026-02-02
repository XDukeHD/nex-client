"use client";

import { Cpu } from "lucide-react";
import { StatWidget } from "./stat-widget";
import { formatPercentage } from "@/lib/format-utils";

interface CpuWidgetProps {
  cpuUsage: number;
}

export function CpuWidget({ cpuUsage }: CpuWidgetProps) {
  const color = cpuUsage > 80 ? "destructive" : cpuUsage > 60 ? "warning" : "primary";
  
  return (
    <StatWidget
      title="CPU Usage"
      icon={<Cpu className="w-4 h-4" />}
      value={formatPercentage(cpuUsage)}
      subtitle="Processing load"
      percentage={cpuUsage}
      color={color}
    />
  );
}
