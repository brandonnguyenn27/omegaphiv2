import { db } from "@/index";
import { events } from "@/db/schema";

export async function getEvents() {
  try {
    const allEvents = await db.select().from(events).orderBy(events.date);
    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
