"use server";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { rushee, rusheeAvailabilities } from "@/db/schema";
import { checkSession } from "@/lib/auth-server";
import { v4 as uuidv4 } from "uuid";
import { pythonApiResponseSchema, fileUploadSchema } from "@/lib/zod/schema";
import { revalidatePath } from "next/cache";
import {
  PythonApiResponse,
  ApiResponse,
  CreateRusheeResponse,
} from "@/lib/types";

const PYTHON_API_URL = process.env.PYTHON_API_URL;

// PDF Parsing Server Action (Preview Only - No Database Creation)
export async function parsePdfApplicationPreview(
  prevState: ApiResponse<PythonApiResponse> | null,
  formData: FormData
): Promise<ApiResponse<PythonApiResponse>> {
  try {
    console.log("=== PDF PARSING PREVIEW SERVER ACTION STARTED ===");
    console.log("Timestamp:", new Date().toISOString());

    // Check session for authentication
    await checkSession();
    console.log("Authentication check passed");

    // Get the file from form data
    const file = formData.get("file") as File;
    console.log("File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    });

    // Validate file upload
    const fileValidation = fileUploadSchema.safeParse({ file });
    if (!fileValidation.success) {
      console.log("File validation failed:", fileValidation.error.errors);
      return {
        success: false,
        message: "File validation failed",
        error: fileValidation.error.errors[0]?.message || "Invalid file",
      };
    }
    console.log("File validation passed");

    // Call Python service
    console.log("Calling Python service for PDF parsing...");
    const pythonResponse = await callPythonService(file);
    if (!pythonResponse.success) {
      return {
        success: false,
        message: "Failed to parse PDF",
        error: pythonResponse.error,
      };
    }

    // Validate Python response
    const validationResult = pythonApiResponseSchema.safeParse(
      pythonResponse.data
    );
    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid data from Python service",
        error: "Response validation failed",
      };
    }

    const parsedData = validationResult.data;

    // Log the parsed PDF data in its raw form
    console.log("=== PDF PARSING RESULTS ===");
    console.log(
      "Raw parsed data from Python API:",
      JSON.stringify(parsedData, null, 2)
    );
    console.log("Rushee data:", {
      name: parsedData.rushee.name,
      email: parsedData.rushee.email,
      phoneNumber: parsedData.rushee.phoneNumber,
      major: parsedData.rushee.major,
    });
    console.log("Availabilities count:", parsedData.availabilities.length);
    console.log(
      "Availabilities data:",
      parsedData.availabilities.map((avail) => ({
        date: avail.date,
        startTime: avail.startTime,
        endTime: avail.endTime,
      }))
    );
    console.log("===========================");

    // Check for duplicate email
    const existingRushee = await db
      .select()
      .from(rushee)
      .where(eq(rushee.email, parsedData.rushee.email))
      .limit(1);

    if (existingRushee.length > 0) {
      return {
        success: false,
        message: "Rushee with this email already exists",
        error: "Duplicate email",
      };
    }

    console.log(
      "=== PDF PARSING PREVIEW SERVER ACTION COMPLETED SUCCESSFULLY ==="
    );
    return {
      success: true,
      message:
        "PDF parsed successfully. Please review and edit the data below.",
      data: parsedData,
    };
  } catch (error) {
    console.error("=== PDF PARSING PREVIEW SERVER ACTION FAILED ===");
    console.error("Error in PDF parsing preview server action:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// PDF Parsing Server Action (Legacy - Creates Database Records)
export async function parsePdfApplication(
  prevState: ApiResponse<CreateRusheeResponse> | null,
  formData: FormData
): Promise<ApiResponse<CreateRusheeResponse>> {
  try {
    console.log("=== PDF PARSING SERVER ACTION STARTED ===");
    console.log("Timestamp:", new Date().toISOString());

    // Check session for authentication
    await checkSession();
    console.log("Authentication check passed");

    // Get the file from form data
    const file = formData.get("file") as File;
    console.log("File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    });

    // Validate file upload
    const fileValidation = fileUploadSchema.safeParse({ file });
    if (!fileValidation.success) {
      console.log("File validation failed:", fileValidation.error.errors);
      return {
        success: false,
        message: "File validation failed",
        error: fileValidation.error.errors[0]?.message || "Invalid file",
      };
    }
    console.log("File validation passed");

    // Call Python service
    console.log("Calling Python service for PDF parsing...");
    const pythonResponse = await callPythonService(file);
    if (!pythonResponse.success) {
      return {
        success: false,
        message: "Failed to parse PDF",
        error: pythonResponse.error,
      };
    }

    // Validate Python response
    const validationResult = pythonApiResponseSchema.safeParse(
      pythonResponse.data
    );
    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid data from Python service",
        error: "Response validation failed",
      };
    }

    const parsedData = validationResult.data;

    // Log the parsed PDF data in its raw form
    console.log("=== PDF PARSING RESULTS ===");
    console.log(
      "Raw parsed data from Python API:",
      JSON.stringify(parsedData, null, 2)
    );
    console.log("Rushee data:", {
      name: parsedData.rushee.name,
      email: parsedData.rushee.email,
      phoneNumber: parsedData.rushee.phoneNumber,
      major: parsedData.rushee.major,
    });
    console.log("Availabilities count:", parsedData.availabilities.length);
    console.log(
      "Availabilities data:",
      parsedData.availabilities.map((avail) => ({
        date: avail.date,
        startTime: avail.startTime,
        endTime: avail.endTime,
      }))
    );
    console.log("===========================");

    // Check for duplicate email
    const existingRushee = await db
      .select()
      .from(rushee)
      .where(eq(rushee.email, parsedData.rushee.email))
      .limit(1);

    if (existingRushee.length > 0) {
      return {
        success: false,
        message: "Rushee with this email already exists",
        error: "Duplicate email",
      };
    }

    // Create rushee and availabilities in a transaction
    console.log("=== CREATING RUSHEE RECORDS ===");
    console.log("Starting rushee creation process...");
    const result = await createRusheeWithAvailabilities(parsedData);
    console.log("Rushee creation completed successfully!");
    console.log("Created rushee ID:", result.rushee.id);
    console.log("Created rushee:", {
      id: result.rushee.id,
      name: result.rushee.name,
      email: result.rushee.email,
      phoneNumber: result.rushee.phoneNumber,
      major: result.rushee.major,
      createdAt: result.rushee.createdAt,
    });
    console.log("Created availabilities count:", result.availabilities.length);
    console.log(
      "Created availabilities:",
      result.availabilities.map((avail) => ({
        id: avail.id,
        rusheeId: avail.rusheeId,
        date: avail.date,
        startTime: avail.startTime,
        endTime: avail.endTime,
      }))
    );
    console.log("=================================");

    // Revalidate the admin dashboard to show new data
    revalidatePath("/admin/rushee");

    console.log("=== PDF PARSING SERVER ACTION COMPLETED SUCCESSFULLY ===");
    return {
      success: true,
      message: "Rushee and availabilities created successfully",
      data: result,
    };
  } catch (error) {
    console.error("=== PDF PARSING SERVER ACTION FAILED ===");
    console.error("Error in PDF parsing server action:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function callPythonService(
  file: File
): Promise<{ success: boolean; data?: PythonApiResponse; error?: string }> {
  try {
    console.log("--- Python Service Call ---");
    console.log("Preparing request to Python service...");

    // Create FormData for Python service
    const formData = new FormData();
    formData.append("file", file);
    console.log("FormData prepared with file:", file.name);

    // Call Python service with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    console.log("Making request to Python service with 30s timeout...");

    const response = await fetch(`${PYTHON_API_URL}/parse-application/`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("Python service response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Python service error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Python service response data parsed successfully");
    console.log("Raw response data:", JSON.stringify(data, null, 2));
    console.log("--- End Python Service Call ---");
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout - Python service took too long to respond",
        };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error calling Python service" };
  }
}

async function createRusheeWithAvailabilities(
  data: PythonApiResponse
): Promise<CreateRusheeResponse> {
  const rusheeId = uuidv4();
  const now = new Date();

  console.log("--- Database Operations ---");
  console.log("Generated rushee ID:", rusheeId);
  console.log("Current timestamp:", now.toISOString());

  // Create rushee record
  console.log("Inserting rushee record into database...");
  const [createdRushee] = await db
    .insert(rushee)
    .values({
      id: rusheeId,
      name: data.rushee.name,
      email: data.rushee.email,
      phoneNumber: data.rushee.phoneNumber || null,
      major: data.rushee.major || null,
      interviewScheduled: false, // New rushees start with no interview scheduled
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  console.log("Rushee record inserted successfully");

  // Get all interview dates to match against
  const { interviewDates } = await import("@/db/schema");
  const allInterviewDates = await db.select().from(interviewDates);
  console.log(
    `Found ${allInterviewDates.length} interview dates to match against`
  );

  // Create availability records
  console.log("Preparing availability records for insertion...");
  console.log(`Total availabilities from PDF: ${data.availabilities.length}`);

  // Filter out availabilities with null dates
  const validAvailabilities = data.availabilities.filter(
    (availability, index) => {
      if (!availability.date) {
        console.log(`Skipping availability ${index + 1}: date is null`);
        return false;
      }
      return true;
    }
  );

  console.log(
    `Valid availabilities after filtering: ${validAvailabilities.length}`
  );

  // Remove duplicate availabilities based on date, startTime, and endTime
  const uniqueAvailabilities = validAvailabilities.filter(
    (availability, index, array) => {
      const isDuplicate =
        array.findIndex(
          (other, otherIndex) =>
            otherIndex < index &&
            other.date === availability.date &&
            other.startTime === availability.startTime &&
            other.endTime === availability.endTime
        ) !== -1;

      if (isDuplicate) {
        console.log(
          `Skipping duplicate availability ${
            index + 1
          }: same date/time as previous entry`
        );
      }

      return !isDuplicate;
    }
  );

  console.log(
    `Unique availabilities after deduplication: ${uniqueAvailabilities.length}`
  );

  const availabilityRecords = uniqueAvailabilities.map(
    (availability, index) => {
      // Create proper Date objects for Drizzle timestamp mode
      const dateObj = new Date(availability.date + "T00:00:00.000Z"); // Convert date string to UTC date
      const startTimeObj = new Date(availability.startTime); // Already in UTC format from Python API
      const endTimeObj = new Date(availability.endTime); // Already in UTC format from Python API

      // Find matching interview date
      const matchingInterviewDate = allInterviewDates.find((id) => {
        const interviewDateStr = id.date.toISOString().split("T")[0];
        const availabilityDateStr = dateObj.toISOString().split("T")[0];
        return interviewDateStr === availabilityDateStr;
      });

      const record = {
        id: uuidv4(),
        rusheeId: rusheeId,
        interviewDateId: matchingInterviewDate?.id || null,
        date: dateObj, // Date object for Drizzle timestamp mode
        startTime: startTimeObj, // Date object for Drizzle timestamp mode
        endTime: endTimeObj, // Date object for Drizzle timestamp mode
        createdAt: now,
        updatedAt: now,
      };
      console.log(`Availability record ${index + 1}:`, {
        id: record.id,
        interviewDateId: matchingInterviewDate?.id || "NO MATCH",
        date: `${
          availability.date
        } -> ${dateObj.toISOString()} (Unix: ${Math.floor(
          dateObj.getTime() / 1000
        )})`,
        startTime: `${
          availability.startTime
        } -> ${startTimeObj.toISOString()} (Unix: ${Math.floor(
          startTimeObj.getTime() / 1000
        )})`,
        endTime: `${
          availability.endTime
        } -> ${endTimeObj.toISOString()} (Unix: ${Math.floor(
          endTimeObj.getTime() / 1000
        )})`,
      });
      return record;
    }
  );

  console.log(
    `Inserting ${availabilityRecords.length} availability records into database...`
  );
  const createdAvailabilities = await db
    .insert(rusheeAvailabilities)
    .values(availabilityRecords)
    .returning();
  console.log("Availability records inserted successfully");

  return {
    rushee: createdRushee,
    availabilities: createdAvailabilities,
  };
}

// Save Edited Rushee Data Server Action
export async function saveEditedRushee(
  prevState: ApiResponse<CreateRusheeResponse> | null,
  formData: FormData
): Promise<ApiResponse<CreateRusheeResponse>> {
  try {
    console.log("=== SAVE EDITED RUSHEE SERVER ACTION STARTED ===");
    console.log("Timestamp:", new Date().toISOString());

    // Check session for authentication
    await checkSession();
    console.log("Authentication check passed");

    // Parse form data
    const rusheeData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phoneNumber: (formData.get("phoneNumber") as string) || null,
      major: (formData.get("major") as string) || null,
    };

    const availabilitiesData = JSON.parse(
      formData.get("availabilities") as string
    );

    console.log("Parsed form data:", {
      rushee: rusheeData,
      availabilitiesCount: availabilitiesData.length,
    });

    // Validate required fields
    if (!rusheeData.name || !rusheeData.email) {
      return {
        success: false,
        message: "Name and email are required",
        error: "Missing required fields",
      };
    }

    // Check for duplicate email
    const existingRushee = await db
      .select()
      .from(rushee)
      .where(eq(rushee.email, rusheeData.email))
      .limit(1);

    if (existingRushee.length > 0) {
      return {
        success: false,
        message: "Rushee with this email already exists",
        error: "Duplicate email",
      };
    }

    // Create rushee and availabilities
    console.log("Creating rushee with edited data...");
    const result = await createRusheeWithAvailabilities({
      rushee: {
        name: rusheeData.name,
        email: rusheeData.email,
        phoneNumber: rusheeData.phoneNumber || undefined,
        major: rusheeData.major || undefined,
      },
      availabilities: availabilitiesData,
    });

    console.log("Rushee creation completed successfully!");
    console.log("Created rushee ID:", result.rushee.id);

    // Revalidate the admin dashboard to show new data
    revalidatePath("/admin/rushee");

    console.log(
      "=== SAVE EDITED RUSHEE SERVER ACTION COMPLETED SUCCESSFULLY ==="
    );
    return {
      success: true,
      message: "Rushee and availabilities created successfully",
      data: result,
    };
  } catch (error) {
    console.error("=== SAVE EDITED RUSHEE SERVER ACTION FAILED ===");
    console.error("Error in save edited rushee server action:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
