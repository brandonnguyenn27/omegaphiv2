import { AuroraComponent } from "@/components/aurora-page/aurora-page";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  // Check if user is already authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is authenticated, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  // If not authenticated, show the landing page
  return <AuroraComponent />;
}
