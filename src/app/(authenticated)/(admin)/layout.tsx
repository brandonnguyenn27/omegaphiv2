import * as React from "react";
import { AppSidebar } from "../../../components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/sidebar/dashboard-header";
import { redirect } from "next/navigation";
import { auth, isEmailWhitelisted, getUserRole } from "@/lib/auth";
import { headers } from "next/headers";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is still whitelisted
  if (session.user.email) {
    const isWhitelisted = await isEmailWhitelisted(session.user.email);
    if (!isWhitelisted) {
      console.log(
        `Admin Layout: Access denied for non-whitelisted email: ${session.user.email}`
      );
      await auth.api.signOut({
        headers: await headers(),
      });
      redirect("/login?error=access_denied");
    }
  }

  // Check if user has admin role
  const userRole = getUserRole(session);
  if (userRole !== "admin") {
    console.log(
      `Admin Layout: Access denied for non-admin user: ${session.user.email}`
    );
    redirect("/dashboard");
  }

  const user: UserProfile = {
    name: session.user.name as string,
    email: session.user.email as string,
    avatar: session.user.image || undefined,
    role: userRole,
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} isAdmin={true} />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
