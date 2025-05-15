"use server";
import { db } from "@/index";
import { events } from "@/db/schema";

import { eq } from "drizzle-orm";
import { userAvailabilities } from "@/db/schema";
import { checkSession } from "@/lib/auth-server";
import { z } from "zod";

const availabilitySchema = z.object({
  date: z
    .string({
      required_error: "Date is required.",
    })
    .min(1, "Date cannot be empty."),

  startTime: z
    .string({
      required_error: "Start time is required.",
    })
    .min(1, "Start time cannot be empty."),
  endTime: z
    .string({
      required_error: "End time is required.",
    })
    .min(1, "End time cannot be empty."),
});

export async function getEvents() {
  await checkSession();

  try {
    const allEvents = await db.select().from(events).orderBy(events.date);
    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getAvailability() {
  const session = await checkSession();
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

export async function addAvailability(formData: FormData) {
  const session = await checkSession();
  const availabilityData = Object.fromEntries(formData);
  const parsedData = availabilitySchema.safeParse(availabilityData);
  if (!parsedData.success) {
    const formFieldErrors = parsedData.error.flatten().fieldErrors;
    return {
      errors: {
        ...formFieldErrors,
      },
    };
  }
  const { date, startTime, endTime } = parsedData.data;
  const userId = session.user.id;
  try {
    console.log("Adding availability for user:", userId);
    await db.insert(userAvailabilities).values({
      id: crypto.randomUUID(),
      userId,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding availability:", error);
    return {
      errors: {
        form: "An error occurred while adding availability.",
      },
    };
  }
  console.log("Availability added successfully for user:", userId);
  return {
    success: true,
    message: "Availability added successfully.",
  };
}
