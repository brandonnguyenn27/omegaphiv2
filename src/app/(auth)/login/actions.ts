"use server";

import { auth } from "../../../lib/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isEmailWhitelisted } from "@/lib/auth";

export async function signOut() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    console.error(
      "Session not found, authentication error, redirecting to login"
    );
    redirect("/login");
  }

  const cookieStore = await cookies();
  await auth.api.signOut({
    headers: new Headers({
      cookie: cookieStore.toString(),
    }),
  });

  redirect("/login");
}

export async function checkWhitelistAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    return { success: false, error: "No authenticated user found" };
  }

  const isWhitelisted = await isEmailWhitelisted(session.user.email);

  if (!isWhitelisted) {
    // Sign out the user if they're not whitelisted
    const cookieStore = await cookies();
    await auth.api.signOut({
      headers: new Headers({
        cookie: cookieStore.toString(),
      }),
    });

    return { success: false, error: "access_denied" };
  }

  return { success: true };
}
