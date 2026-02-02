"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NexProvider } from "@/contexts/nex-context";
import { Dashboard } from "@/components/dashboard";
import { getAuthToken, getConnectionConfig } from "@/lib/nex-store";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    const config = getConnectionConfig();

    if (!config || !token) {
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    router.replace("/");
  };

  return (
    <NexProvider onLogout={handleLogout}>
      <Dashboard />
    </NexProvider>
  );
}
