"use server";

import { auth } from "./auth";
import { cookies } from "next/headers";

export async function signOut() {
  const cookieStore = await cookies();
  await auth.api.signOut({
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  return { success: true };
}
