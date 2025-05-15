"use server";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function checkSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    console.error("Session not found, authentication error");
    throw new Error("Unauthorized");
  }
  return session;
}
