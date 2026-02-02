"use client";

import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from "lucide-react";
import { StatWidget } from "./stat-widget";
import { formatPercentage } from "@/lib/format-utils";
import type { BatteryStatus } from "@/lib/nex-types";

interface BatteryWidgetProps {
  battery: BatteryStatus;
}

function getBatteryIcon(percentage: number, pluggedIn: boolean) {
  if (pluggedIn) return <BatteryCharging className="w-4 h-4" />;
  if (percentage >= 90) return <BatteryFull className="w-4 h-4" />;
  if (percentage >= 50) return <BatteryMedium className="w-4 h-4" />;
  if (percentage >= 20) return <BatteryLow className="w-4 h-4" />;
  return <BatteryWarning className="w-4 h-4" />;
}

export function BatteryWidget({ battery }: BatteryWidgetProps) {
  const { percentage, plugged_in } = battery;
  
  let color: "primary" | "accent" | "success" | "warning" | "destructive" = "success";
  if (percentage < 20 && !plugged_in) {
    color = "destructive";
  } else if (percentage < 40 && !plugged_in) {
    color = "warning";
  } else if (plugged_in) {
    color = "primary";
  }

  return (
    <StatWidget
      title="Battery"
      icon={getBatteryIcon(percentage, plugged_in)}
      value={formatPercentage(percentage)}
      subtitle={plugged_in ? "Charging" : "On battery"}
      percentage={percentage}
      color={color}
    />
  );
}
