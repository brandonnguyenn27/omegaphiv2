"use server";

import { auth } from "../../../lib/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
