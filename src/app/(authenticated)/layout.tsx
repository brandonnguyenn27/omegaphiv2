import * as React from "react";
import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/sidebar/dashboard-header";
import SidebarWrapper from "@/components/sidebar/sidebar-wrapper";
import { redirect } from "next/navigation";
import { auth, isEmailWhitelisted, getUserRole } from "@/lib/auth";
import { headers } from "next/headers";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export default async function AuthenticatedLayout({
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
        `Authenticated Layout: Access denied for non-whitelisted email: ${session.user.email}`
      );
      await auth.api.signOut({
        headers: await headers(),
      });
      redirect("/login?error=access_denied");
    }
  }

  const userRole = await getUserRole(session);

  const user: UserProfile = {
    name: session.user.name as string,
    email: session.user.email as string,
    avatar: session.user.image || undefined,
    role: userRole,
  };

  // Determine if user is admin based on role
  const isAdmin = userRole === "admin";

  return (
    <SidebarWrapper>
      <AppSidebar user={user} isAdmin={isAdmin} />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarWrapper>
  );
}
