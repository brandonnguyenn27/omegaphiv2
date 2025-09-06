"use client";

import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  const [open, setOpen] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Read the cookie value on client side
    const savedState = getCookieValue(SIDEBAR_COOKIE_NAME);
    if (savedState !== null) {
      setOpen(savedState === "true");
    }
    setIsHydrated(true);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Save to cookie
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${newOpen}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`;
  };

  // During SSR and before hydration, always use open=true
  // After hydration, use the actual saved state
  return (
    <SidebarProvider
      open={isHydrated ? open : true}
      onOpenChange={handleOpenChange}
    >
      {children}
    </SidebarProvider>
  );
}
