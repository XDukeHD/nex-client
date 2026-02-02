"use client";

import { MemoryStick } from "lucide-react";
import { StatWidget } from "./stat-widget";
import { formatBytes } from "@/lib/format-utils";

interface MemoryWidgetProps {
  memoryBytes: number;
  totalMemory?: number;
}

// Assume 16GB total if not provided
const DEFAULT_TOTAL_MEMORY = 16 * 1024 * 1024 * 1024;

export function MemoryWidget({ memoryBytes, totalMemory = DEFAULT_TOTAL_MEMORY }: MemoryWidgetProps) {
  const percentage = (memoryBytes / totalMemory) * 100;
  const color = percentage > 85 ? "destructive" : percentage > 70 ? "warning" : "accent";
  
  return (
    <StatWidget
      title="Memory"
      icon={<MemoryStick className="w-4 h-4" />}
      value={formatBytes(memoryBytes)}
      subtitle={`of ${formatBytes(totalMemory)}`}
      percentage={percentage}
      color={color}
    />
  );
}
