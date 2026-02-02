"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { LoadingScreen } from "@/components/loading-screen";
import { ConnectionForm } from "@/components/connection-form";
import { LoginForm } from "@/components/login-form";
import {
  getConnectionConfig,
  getAuthToken,
  type ConnectionConfig,
} from "@/lib/nex-store";

type AppState = "loading" | "connection" | "login" | "redirecting";

export default function SetupPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>("loading");
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig | null>(null);

  // Check existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const existingToken = getAuthToken();
      const existingConfig = getConnectionConfig();

      if (existingToken && existingConfig) {
        // Already authenticated, redirect to home
        setAppState("redirecting");
        router.replace("/home");
      } else if (existingConfig) {
        // Has connection but no token, show login
        setConnectionConfig(existingConfig);
        setAppState("login");
      } else {
        // No config, show connection form
        setAppState("connection");
      }
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLoadingComplete = useCallback(() => {
    const existingToken = getAuthToken();
    const existingConfig = getConnectionConfig();

    if (existingToken && existingConfig) {
      setAppState("redirecting");
      router.replace("/home");
    } else if (existingConfig) {
      setConnectionConfig(existingConfig);
      setAppState("login");
    } else {
      setAppState("connection");
    }
  }, [router]);

  const handleConnect = useCallback((config: ConnectionConfig) => {
    setConnectionConfig(config);
    setAppState("login");
  }, []);

  const handleLogin = useCallback(
    (_token: string) => {
      setAppState("redirecting");
      router.replace("/home");
    },
    [router]
  );

  const handleBack = useCallback(() => {
    setAppState("connection");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />

      {appState === "loading" && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {appState === "connection" && (
        <ConnectionForm
          onConnect={handleConnect}
          initialConfig={connectionConfig}
        />
      )}

      {appState === "login" && connectionConfig && (
        <LoginForm
          config={connectionConfig}
          onLogin={handleLogin}
          onBack={handleBack}
        />
      )}

      {appState === "redirecting" && (
        <div className="text-center animate-fade-in-up">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  );
}
