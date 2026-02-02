"use client";

import { HardDrive } from "lucide-react";
import { StatWidget } from "./stat-widget";
import { formatBytes } from "@/lib/format-utils";

interface DiskWidgetProps {
  diskBytes: number;
  totalDisk?: number;
}

// Assume 512GB total if not provided
const DEFAULT_TOTAL_DISK = 512 * 1024 * 1024 * 1024;

export function DiskWidget({ diskBytes, totalDisk = DEFAULT_TOTAL_DISK }: DiskWidgetProps) {
  const percentage = (diskBytes / totalDisk) * 100;
  const color = percentage > 90 ? "destructive" : percentage > 75 ? "warning" : "primary";
  
  return (
    <StatWidget
      title="Disk Usage"
      icon={<HardDrive className="w-4 h-4" />}
      value={formatBytes(diskBytes)}
      subtitle={`of ${formatBytes(totalDisk)}`}
      percentage={percentage}
      color={color}
    />
  );
}
