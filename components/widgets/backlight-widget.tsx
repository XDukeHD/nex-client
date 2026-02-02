"use client";

import { Sun, SunDim, SunMedium } from "lucide-react";
import { StatWidget } from "./stat-widget";
import { formatPercentage } from "@/lib/format-utils";

interface BacklightWidgetProps {
  backlight: number;
}

function getBacklightIcon(backlight: number) {
  if (backlight < 33) return <SunDim className="w-4 h-4" />;
  if (backlight < 66) return <SunMedium className="w-4 h-4" />;
  return <Sun className="w-4 h-4" />;
}

export function BacklightWidget({ backlight }: BacklightWidgetProps) {
  return (
    <StatWidget
      title="Backlight"
      icon={getBacklightIcon(backlight)}
      value={formatPercentage(backlight)}
      subtitle="Display brightness"
      percentage={backlight}
      color="warning"
    />
  );
}
