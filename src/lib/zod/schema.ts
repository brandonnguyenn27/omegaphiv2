import { z } from "zod";

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
