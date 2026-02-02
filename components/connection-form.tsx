"use client";

import React from "react"

import { useState } from "react";
import { Server, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveConnectionConfig, type ConnectionConfig } from "@/lib/nex-store";
import { toast } from "sonner";

interface ConnectionFormProps {
  onConnect: (config: ConnectionConfig) => void;
  initialConfig?: ConnectionConfig | null;
}

export function ConnectionForm({ onConnect, initialConfig }: ConnectionFormProps) {
  const [ip, setIp] = useState(initialConfig?.ip || "");
  const [port, setPort] = useState(initialConfig?.port?.toString() || "9384");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ip.trim()) {
      toast.error("Please enter a server IP address");
      return;
    }

    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      toast.error("Please enter a valid port number (1-65535)");
      return;
    }

    setIsConnecting(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://${ip}:${portNum}/v1/websocket`, {
        method: "HEAD",
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      const config: ConnectionConfig = { ip, port: portNum };
      saveConnectionConfig(config);
      toast.success("Server connection saved");
      onConnect(config);
    } catch {
      const config: ConnectionConfig = { ip, port: portNum };
      saveConnectionConfig(config);
      toast.info("Connection saved - please verify credentials");
      onConnect(config);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <Card className="glass border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Server className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Connect to NEX Server</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your local NEX server details to begin monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ip" className="text-sm font-medium">
                Server IP Address
              </Label>
              <div className="relative">
                <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="ip"
                  type="text"
                  placeholder="192.168.1.100"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="pl-10 bg-input/50 border-border/50 focus:border-primary"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="port" className="text-sm font-medium">
                Port
              </Label>
              <Input
                id="port"
                type="number"
                placeholder="9384"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="bg-input/50 border-border/50 focus:border-primary"
                min={1}
                max={65535}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
