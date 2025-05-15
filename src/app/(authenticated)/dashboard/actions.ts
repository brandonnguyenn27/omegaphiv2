"use server";
import { db } from "@/index";
import { events } from "@/db/schema";

import { eq } from "drizzle-orm";
import { userAvailabilities } from "@/db/schema";
import { checkSession } from "@/lib/auth-server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { InferSelectModel } from "drizzle-orm";

type UserAvailabilities = InferSelectModel<typeof userAvailabilities>;

export const insertUserAvailabilitySchema = z
  .object({
    userId: z.string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    }),

    date: z.date({
      required_error: "Date is required",
      invalid_type_error: "Invalid date format",
    }),
    startTime: z.date({
      required_error: "Start time is required",
      invalid_type_error: "Invalid start time format",
    }),
    endTime: z.date({
      required_error: "End time is required",
      invalid_type_error: "Invalid end time format",
    }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
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

export async function getAvailability(): Promise<UserAvailabilities[]> {
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
  const dateString = formData.get("date") as string;
  const startTimeString = formData.get("startTime") as string;
  const endTimeString = formData.get("endTime") as string;

  const dataToValidate = {
    userId: session.user.id,
    date: dateString ? new Date(dateString) : undefined,
    startTime: startTimeString ? new Date(startTimeString) : undefined,
    endTime: endTimeString ? new Date(endTimeString) : undefined,
  };

  const parsedData = insertUserAvailabilitySchema.safeParse(dataToValidate);

  if (!parsedData.success) {
    const formFieldErrors = parsedData.error.flatten().fieldErrors;
    console.error("Validation errors:", formFieldErrors);
    return {
      errors: {
        ...formFieldErrors,
      },
    };
  }

  const { date, startTime, endTime, userId } = parsedData.data;

  try {
    await db.insert(userAvailabilities).values({
      id: uuidv4(),
      userId,
      date: date,
      startTime: startTime,
      endTime: endTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Availability added successfully for user:", userId);

    return {
      success: true,
      message: "Availability added successfully.",
    };
  } catch (error) {
    console.error("Error adding availability:", error);
    return {
      errors: {
        form: "An error occurred while saving your availability. Please try again.",
      },
    };
  }
}
