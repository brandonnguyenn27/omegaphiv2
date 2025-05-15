"use server";
import { db } from "@/index";
import { events } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { userAvailabilities } from "@/db/schema";

export async function getEvents() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.error("Session not found, authentication error");
    throw new Error("Unauthorized");
  }

  try {
    const allEvents = await db.select().from(events).orderBy(events.date);
    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getAvailability() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    console.error("Session not found, authentication error");
    throw new Error("Unauthorized");
  }
  try {
    const userId = session.user.id;
    const userAvailability = await db
      .select()
      .from(userAvailabilities)
      .where(eq(userAvailabilities.userId, userId))
      .orderBy(userAvailabilities.date);
    return userAvailability;
  } catch (error) {
    console.error("Error fetching user availability:", error);
    return [];
  }
}
