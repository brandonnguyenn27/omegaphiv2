import * as React from "react";
import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/sidebar/dashboard-header";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string; // Avatar can be optional
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(), // Use headers() here
  });

  if (!session?.user) {
    redirect("/login"); // Redirect if no session or user
  }

  const user: UserProfile = {
    name: session.user.name as string,
    email: session.user.email as string,
    avatar: session.user.image || undefined, // Handle null image, pass undefined
  };
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
