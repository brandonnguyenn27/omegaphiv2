"use server";

import { auth } from "./auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const cookieStore = await cookies();
  await auth.api.signOut({
    headers: new Headers({
      cookie: cookieStore.toString(),
    }),
  });

  redirect("/login");
}
