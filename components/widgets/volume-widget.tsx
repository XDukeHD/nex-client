"use client";

import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { StatWidget } from "./stat-widget";
import { formatPercentage } from "@/lib/format-utils";

interface VolumeWidgetProps {
  volume: number;
}

function getVolumeIcon(volume: number) {
  if (volume === 0) return <VolumeX className="w-4 h-4" />;
  if (volume < 33) return <Volume className="w-4 h-4" />;
  if (volume < 66) return <Volume1 className="w-4 h-4" />;
  return <Volume2 className="w-4 h-4" />;
}

export function VolumeWidget({ volume }: VolumeWidgetProps) {
  return (
    <StatWidget
      title="Volume"
      icon={getVolumeIcon(volume)}
      value={formatPercentage(volume)}
      subtitle="System audio"
      percentage={volume}
      color="accent"
    />
  );
}
