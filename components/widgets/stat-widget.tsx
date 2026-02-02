"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatWidgetProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  subtitle?: string;
  percentage?: number;
  color?: "primary" | "accent" | "success" | "warning" | "destructive";
  className?: string;
  children?: ReactNode;
}

const colorMap = {
  primary: "text-primary",
  accent: "text-accent",
  success: "text-nex-success",
  warning: "text-nex-warning",
  destructive: "text-destructive",
};

const bgColorMap = {
  primary: "bg-primary/10",
  accent: "bg-accent/10",
  success: "bg-nex-success/10",
  warning: "bg-nex-warning/10",
  destructive: "bg-destructive/10",
};

const progressColorMap = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-nex-success",
  warning: "bg-nex-warning",
  destructive: "bg-destructive",
};

export function StatWidget({
  title,
  icon,
  value,
  subtitle,
  percentage,
  color = "primary",
  className,
  children,
}: StatWidgetProps) {
  return (
    <Card className={cn("glass border-border/50 overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", bgColorMap[color])}>
          <span className={colorMap[color]}>{icon}</span>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-1">
          <span className={cn("text-2xl font-bold", colorMap[color])}>
            {value}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
          {percentage !== undefined && (
            <div className="mt-2">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500 ease-out rounded-full",
                    progressColorMap[color]
                  )}
                  style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                />
              </div>
            </div>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
