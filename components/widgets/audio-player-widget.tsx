"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Square,
  Music,
  Disc3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format-utils";
import { getBaseUrl } from "@/lib/nex-store";
import { useNex } from "@/contexts/nex-context";
import type { AudioPlayer } from "@/lib/nex-types";

interface AudioPlayerWidgetProps {
  player: AudioPlayer;
}

export function AudioPlayerWidget({ player }: AudioPlayerWidgetProps) {
  const { sendAudioCommand } = useNex();
  const [imageError, setImageError] = useState(false);

  const baseUrl = getBaseUrl();
  const artUrl = player.art_url && baseUrl ? `${baseUrl}${player.art_url}` : null;
  const progress = player.duration > 0 ? (player.timestamp / player.duration) * 100 : 0;

  const handlePlayPause = () => {
    sendAudioCommand("audio-play-pause", player.id);
  };

  const handleNext = () => {
    sendAudioCommand("audio-next", player.id);
  };

  const handlePrevious = () => {
    sendAudioCommand("audio-previous", player.id);
  };

  const handleStop = () => {
    sendAudioCommand("audio-stop", player.id);
  };

  return (
    <Card className="glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Album Art */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
            {artUrl && !imageError ? (
              <img
                src={artUrl || "/placeholder.svg"}
                alt={`${player.album || player.title} artwork`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <Disc3 className={cn(
                  "w-10 h-10 text-primary/60",
                  player.playing && "animate-spin-slow"
                )} />
              </div>
            )}
            {/* Playing indicator */}
            {player.playing && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="flex gap-0.5 items-end h-4">
                  <div className="w-1 bg-primary animate-pulse" style={{ height: "60%", animationDelay: "0ms" }} />
                  <div className="w-1 bg-primary animate-pulse" style={{ height: "100%", animationDelay: "150ms" }} />
                  <div className="w-1 bg-primary animate-pulse" style={{ height: "40%", animationDelay: "300ms" }} />
                  <div className="w-1 bg-primary animate-pulse" style={{ height: "80%", animationDelay: "450ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">
                  {player.name}
                </span>
                {player.playing && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
                    Playing
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-sm text-foreground truncate">
                {player.title || "Unknown Title"}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {player.artist || "Unknown Artist"}
                {player.album && ` • ${player.album}`}
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono w-8">
                {formatDuration(player.timestamp)}
              </span>
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">
                {formatDuration(player.duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-center gap-1">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-secondary"
                onClick={handlePrevious}
                aria-label="Previous track"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90"
                onClick={handlePlayPause}
                aria-label={player.playing ? "Pause" : "Play"}
              >
                {player.playing ? (
                  <Pause className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-secondary"
                onClick={handleNext}
                aria-label="Next track"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] text-muted-foreground hover:text-destructive px-2"
              onClick={handleStop}
            >
              <Square className="w-3 h-3 mr-1" />
              Stop
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AudioPlayersWidgetProps {
  players: AudioPlayer[];
}

export function AudioPlayersWidget({ players }: AudioPlayersWidgetProps) {
  if (players.length === 0) {
    return (
      <Card className="glass border-border/50 overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="font-medium text-foreground mb-1">No Active Players</h4>
          <p className="text-sm text-muted-foreground">
            Audio players will appear here when media is playing
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player) => (
        <AudioPlayerWidget key={player.id} player={player} />
      ))}
    </div>
  );
}
