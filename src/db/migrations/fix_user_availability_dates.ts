import { db } from "@/index";
import { userAvailabilities, interviewDates } from "@/db/schema";
import { eq, isNotNull } from "drizzle-orm";

/**
 * Migration script to fix user availability dates
 *
 * The issue: User availabilities have start/end times with date 1970-01-01 (Unix epoch)
 * The fix: Update them to use the actual interview date from interviewDates table
 */
export async function fixUserAvailabilityDates() {
  console.log("Starting user availability date fix migration...");

  try {
    // Get all user availabilities that have interviewDateId set
    const availabilitiesWithInterviewDate = await db
      .select()
      .from(userAvailabilities)
      .where(isNotNull(userAvailabilities.interviewDateId));

    console.log(
      `Found ${availabilitiesWithInterviewDate.length} user availabilities with interview date IDs`
    );

    // Get all interview dates
    const allInterviewDates = await db.select().from(interviewDates);
    console.log(`Found ${allInterviewDates.length} interview dates`);

    // Create a map of interview date ID to actual date
    const interviewDateMap = new Map();
    allInterviewDates.forEach((id) => {
      interviewDateMap.set(id.id, id.date);
    });

    let fixedCount = 0;
    let skippedCount = 0;

    // Process each availability
    for (const availability of availabilitiesWithInterviewDate) {
      if (
        !availability.interviewDateId ||
        !availability.startTime ||
        !availability.endTime
      ) {
        skippedCount++;
        continue;
      }

      const interviewDate = interviewDateMap.get(availability.interviewDateId);
      if (!interviewDate) {
        console.log(
          `No interview date found for ID: ${availability.interviewDateId}`
        );
        skippedCount++;
        continue;
      }

      // Extract time components from the existing start/end times
      const startTime = new Date(availability.startTime);
      const endTime = new Date(availability.endTime);

      // Create new dates with the correct interview date but same time (using UTC)
      const newStartTime = new Date(interviewDate);
      newStartTime.setUTCHours(
        startTime.getUTCHours(),
        startTime.getUTCMinutes(),
        startTime.getUTCSeconds(),
        startTime.getUTCMilliseconds()
      );

      const newEndTime = new Date(interviewDate);
      newEndTime.setUTCHours(
        endTime.getUTCHours(),
        endTime.getUTCMinutes(),
        endTime.getUTCSeconds(),
        endTime.getUTCMilliseconds()
      );

      // Update the availability record
      await db
        .update(userAvailabilities)
        .set({
          date: interviewDate,
          startTime: newStartTime,
          endTime: newEndTime,
          updatedAt: new Date(),
        })
        .where(eq(userAvailabilities.id, availability.id));

      fixedCount++;

      if (fixedCount % 10 === 0) {
        console.log(`Fixed ${fixedCount} availabilities...`);
      }
    }

    console.log(`Migration completed successfully!`);
    console.log(`Fixed: ${fixedCount} availabilities`);
    console.log(`Skipped: ${skippedCount} availabilities`);

    return {
      success: true,
      fixed: fixedCount,
      skipped: skippedCount,
    };
  } catch (error) {
    console.error("Migration failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Also fix rushee availabilities if they have the same issue
export async function fixRusheeAvailabilityDates() {
  console.log("Starting rushee availability date fix migration...");

  try {
    // Get all rushee availabilities
    const { rusheeAvailabilities } = await import("@/db/schema");

    const allRusheeAvailabilities = await db
      .select()
      .from(rusheeAvailabilities);

    console.log(
      `Found ${allRusheeAvailabilities.length} rushee availabilities total`
    );

    // Get all interview dates
    const allInterviewDates = await db.select().from(interviewDates);
    console.log(`Found ${allInterviewDates.length} interview dates`);

    let fixedCount = 0;
    let skippedCount = 0;

    // Process each availability
    for (const availability of allRusheeAvailabilities) {
      if (!availability.startTime || !availability.endTime) {
        skippedCount++;
        continue;
      }

      // Find matching interview date by date
      const availabilityDateStr = availability.date
        ?.toISOString()
        .split("T")[0];
      const matchingInterviewDate = allInterviewDates.find((id) => {
        const interviewDateStr = id.date.toISOString().split("T")[0];
        return interviewDateStr === availabilityDateStr;
      });

      if (!matchingInterviewDate) {
        console.log(
          `No matching interview date found for availability date: ${availabilityDateStr}`
        );
        skippedCount++;
        continue;
      }

      // Extract time components from the existing start/end times
      const startTime = new Date(availability.startTime);
      const endTime = new Date(availability.endTime);

      // Create new dates with the correct interview date but same time (using UTC)
      const newStartTime = new Date(matchingInterviewDate.date);
      newStartTime.setUTCHours(
        startTime.getUTCHours(),
        startTime.getUTCMinutes(),
        startTime.getUTCSeconds(),
        startTime.getUTCMilliseconds()
      );

      const newEndTime = new Date(matchingInterviewDate.date);
      newEndTime.setUTCHours(
        endTime.getUTCHours(),
        endTime.getUTCMinutes(),
        endTime.getUTCSeconds(),
        endTime.getUTCMilliseconds()
      );

      // Update the availability record
      await db
        .update(rusheeAvailabilities)
        .set({
          interviewDateId: matchingInterviewDate.id,
          date: matchingInterviewDate.date,
          startTime: newStartTime,
          endTime: newEndTime,
          updatedAt: new Date(),
        })
        .where(eq(rusheeAvailabilities.id, availability.id));

      fixedCount++;

      if (fixedCount % 10 === 0) {
        console.log(`Fixed ${fixedCount} rushee availabilities...`);
      }
    }

    console.log(`Rushee migration completed successfully!`);
    console.log(`Fixed: ${fixedCount} rushee availabilities`);
    console.log(`Skipped: ${skippedCount} rushee availabilities`);

    return {
      success: true,
      fixed: fixedCount,
      skipped: skippedCount,
    };
  } catch (error) {
    console.error("Rushee migration failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Run both migrations
export async function runAvailabilityDateFix() {
  console.log("=== Starting Availability Date Fix Migration ===");

  const userResult = await fixUserAvailabilityDates();
  const rusheeResult = await fixRusheeAvailabilityDates();

  console.log("=== Migration Summary ===");
  console.log("User availabilities:", userResult);
  console.log("Rushee availabilities:", rusheeResult);

  return {
    userResult,
    rusheeResult,
  };
}
