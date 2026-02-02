"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete">("loading");

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setPhase("complete");
        setTimeout(onComplete, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        phase === "complete" && "opacity-0 pointer-events-none"
      )}
    >
      {/* Animated logo */}
      <div className="relative mb-8">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer ring */}
          <svg
            className="absolute w-full h-full animate-spin-slow"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="70 200"
              className="text-primary"
            />
          </svg>

          {/* Inner hexagon */}
          <svg className="w-12 h-12 animate-pulse-glow" viewBox="0 0 100 100">
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
            <text
              x="50"
              y="58"
              textAnchor="middle"
              className="fill-foreground font-mono text-2xl font-bold"
            >
              NEX
            </text>
          </svg>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse-glow" />
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status text */}
      <p className="mt-4 text-sm text-muted-foreground font-mono">
        {progress < 30 && "Initializing system..."}
        {progress >= 30 && progress < 60 && "Loading components..."}
        {progress >= 60 && progress < 90 && "Preparing interface..."}
        {progress >= 90 && "Ready"}
      </p>

      {/* Version */}
      <p className="absolute bottom-8 text-xs text-muted-foreground/50 font-mono">
        v1.0.0
      </p>
    </div>
  );
}
