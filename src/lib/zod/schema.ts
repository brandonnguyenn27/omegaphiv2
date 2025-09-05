import { z } from "zod";

export const insertUserAvailabilitySchema = z
  .object({
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

// Schema for rushee data validation
export const rusheeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email format").max(255, "Email is too long"),
  phoneNumber: z.string().optional(),
  major: z.string().optional(),
});

// Schema for availability data validation
export const availabilitySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
});

// Schema for Python API response validation
export const pythonApiResponseSchema = z.object({
  rushee: rusheeSchema,
  availabilities: z.array(availabilitySchema),
});

// Schema for file upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    }),
});
