"use server";
import { db } from "@/index";
import { events } from "@/db/schema";

import { eq } from "drizzle-orm";
import { userAvailabilities, interviewDates } from "@/db/schema";
import { checkSession } from "@/lib/auth-server";
import { v4 as uuidv4 } from "uuid";
import { InferSelectModel } from "drizzle-orm";
import { insertUserAvailabilitySchema } from "@/lib/zod/schema";
import { revalidatePath } from "next/cache";

type UserAvailabilities = InferSelectModel<typeof userAvailabilities>;
type InterviewDates = InferSelectModel<typeof interviewDates>;

type AvailabilityFormData = {
  date: string;
  startTime: string;
  endTime: string;
};

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof AvailabilityFormData]?: string[];
  };
  values?: AvailabilityFormData;
}

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

export async function getInterviewDates(): Promise<InterviewDates[]> {
  await checkSession();
  try {
    console.log("Fetching interview dates...");
    const interviewDatesData = await db
      .select()
      .from(interviewDates)
      .orderBy(interviewDates.date);
    return interviewDatesData;
  } catch (error) {
    console.error("Error fetching interview dates:", error);
    return [];
  }
}

export async function deleteAvailability(
  availabilityId: string,
  userId: string
) {
  const session = await checkSession();
  if (session.user.id !== userId) {
    throw new Error("Unauthorized action");
  }
  try {
    await db
      .delete(userAvailabilities)
      .where(eq(userAvailabilities.id, availabilityId));
    console.log("Availability deleted successfully, ID:", availabilityId);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting availability:", error);
    throw new Error("Failed to delete availability");
  }
}

export async function addAvailability(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await checkSession();
  const dateString = formData.get("date") as string;
  const startTimeString = formData.get("startTime") as string;
  const endTimeString = formData.get("endTime") as string;
  const interviewDateId = formData.get("interviewDateId") as string;

  // Get the interview date to use for the timestamps
  let interviewDate: Date | undefined;
  if (interviewDateId) {
    const { interviewDates } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const interviewDateRecord = await db
      .select()
      .from(interviewDates)
      .where(eq(interviewDates.id, interviewDateId))
      .limit(1);

    if (interviewDateRecord.length > 0) {
      interviewDate = interviewDateRecord[0].date;
    }
  }

  // Fallback to the date string if no interview date found
  if (!interviewDate && dateString) {
    interviewDate = new Date(dateString + "T00:00:00.000Z");
  }

  const dataToValidate = {
    date: interviewDate,
    startTime:
      startTimeString && interviewDate
        ? new Date(
            `${
              interviewDate.toISOString().split("T")[0]
            }T${startTimeString}:00.000Z`
          )
        : undefined,
    endTime:
      endTimeString && interviewDate
        ? new Date(
            `${
              interviewDate.toISOString().split("T")[0]
            }T${endTimeString}:00.000Z`
          )
        : undefined,
  };

  const parsedData = insertUserAvailabilitySchema.safeParse(dataToValidate);
  console.log("Parsed data:", parsedData);

  if (!parsedData.success) {
    const formFieldErrors = parsedData.error.flatten().fieldErrors;
    console.error("Validation errors:", formFieldErrors);
    return {
      errors: {
        ...formFieldErrors,
      },
      success: false,
      message: "Form failed. Please check your input.",
      values: {
        date: dateString,
        startTime: startTimeString,
        endTime: endTimeString,
      },
    };
  }

  const userId = session.user.id;
  const validatedData = parsedData.data;

  try {
    await db.insert(userAvailabilities).values({
      id: uuidv4(),
      userId: userId,
      interviewDateId: interviewDateId || null,
      date: validatedData.date,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Availability added successfully for user:", userId);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Availability added successfully.",
    };
  } catch (error) {
    console.error("Error adding availability:", error);
    return {
      success: false,
      message: "Failed to add availability. Please try again.",
      values: {
        date: dateString,
        startTime: startTimeString,
        endTime: endTimeString,
      },
    };
  }
}
