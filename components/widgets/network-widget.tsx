"use client";

import { useRef, useEffect } from "react";
import { ArrowDown, ArrowUp, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes } from "@/lib/format-utils";
import type { NetworkStats } from "@/lib/nex-types";

interface NetworkWidgetProps {
  network: NetworkStats;
}

export function NetworkWidget({ network }: NetworkWidgetProps) {
  const prevNetworkRef = useRef<NetworkStats | null>(null);
  const speedRef = useRef({ rx: 0, tx: 0 });
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = (now - lastUpdateRef.current) / 1000;
    
    if (prevNetworkRef.current && elapsed > 0 && elapsed < 5) {
      const rxDiff = network.rx_bytes - prevNetworkRef.current.rx_bytes;
      const txDiff = network.tx_bytes - prevNetworkRef.current.tx_bytes;
      
      speedRef.current = {
        rx: Math.max(0, rxDiff / elapsed),
        tx: Math.max(0, txDiff / elapsed),
      };
    }
    
    prevNetworkRef.current = network;
    lastUpdateRef.current = now;
  }, [network]);

  return (
    <Card className="glass border-border/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Network
        </CardTitle>
        <div className="p-2 rounded-lg bg-nex-info/10">
          <Network className="w-4 h-4 text-nex-info" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          {/* Download */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-nex-success/10">
              <ArrowDown className="w-3.5 h-3.5 text-nex-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Download</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {formatBytes(network.rx_bytes)}
              </p>
            </div>
            <span className="text-xs text-nex-success font-mono">
              {formatBytes(speedRef.current.rx)}/s
            </span>
          </div>

          {/* Upload */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-accent/10">
              <ArrowUp className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Upload</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {formatBytes(network.tx_bytes)}
              </p>
            </div>
            <span className="text-xs text-accent font-mono">
              {formatBytes(speedRef.current.tx)}/s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
