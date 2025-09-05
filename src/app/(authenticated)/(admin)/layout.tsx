import { redirect } from "next/navigation";
import { auth, getUserRole } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session (authentication is already handled by parent layout)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Double-check session exists (should always be true due to parent layout)
  if (!session?.user) {
    console.log("No session or user found, redirecting to login");
    redirect("/login");
  }

  // Check if user has admin role
  const userRole = await getUserRole(session);

  if (userRole !== "admin") {
    console.log(
      `Admin Layout: Access denied for non-admin user: ${session.user.email} (role: ${userRole})`
    );
    redirect("/dashboard");
  }

  console.log("Admin access granted for:", session.user.email);

  // Admin layout just passes through children - sidebar is handled by parent (authenticated) layout
  return <>{children}</>;
}
