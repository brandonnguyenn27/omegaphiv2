// components/header.tsx (or wherever you keep your components)

"use client"; // This component needs client-side interactivity for the button

import { Button } from "@/components/ui/button"; // Adjust path if necessary
import { signOut } from "@/app/(auth)/login/actions";
import { redirect } from "next/navigation";

export function Header() {
  const handleSignOut = async () => {
    await signOut();
    redirect("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      {/* Title on the left */}
      <div>
        <h1 className="text-xl font-semibold">Omega Phi</h1>
      </div>

      {/* Sign Out Button on the right */}
      <div>
        {/* Using Shadcn's Button component */}
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}
