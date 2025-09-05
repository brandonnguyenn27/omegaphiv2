import { db } from "@/index";
import { userAvailabilities, interviewDates } from "@/db/schema";
import { eq, and, gte, lte, isNull } from "drizzle-orm";

/**
 * Migration script to convert existing userAvailabilities data
 * from date/startTime/endTime fields to interviewDateId references
 */
export async function migrateUserAvailabilities() {
  console.log("Starting userAvailabilities migration...");

  try {
    // Get all userAvailabilities that don't have interviewDateId set
    const availabilitiesToMigrate = await db
      .select()
      .from(userAvailabilities)
      .where(isNull(userAvailabilities.interviewDateId));

    console.log(
      `Found ${availabilitiesToMigrate.length} availabilities to migrate`
    );

    let migratedCount = 0;
    let skippedCount = 0;

    for (const availability of availabilitiesToMigrate) {
      if (
        !availability.date ||
        !availability.startTime ||
        !availability.endTime
      ) {
        console.log(
          `Skipping availability ${availability.id} - missing date/time data`
        );
        skippedCount++;
        continue;
      }

      // Find matching interview date based on date and time overlap
      const matchingInterviewDate = await db
        .select()
        .from(interviewDates)
        .where(
          and(
            eq(interviewDates.date, availability.date),
            lte(interviewDates.startTime, availability.startTime),
            gte(interviewDates.endTime, availability.endTime)
          )
        )
        .limit(1);

      if (matchingInterviewDate.length > 0) {
        // Update the availability with the matching interview date ID
        await db
          .update(userAvailabilities)
          .set({
            interviewDateId: matchingInterviewDate[0].id,
            updatedAt: new Date(),
          })
          .where(eq(userAvailabilities.id, availability.id));

        console.log(
          `Migrated availability ${availability.id} to interview date ${matchingInterviewDate[0].id}`
        );
        migratedCount++;
      } else {
        console.log(
          `No matching interview date found for availability ${availability.id}`
        );
        skippedCount++;
      }
    }

    console.log(
      `Migration complete: ${migratedCount} migrated, ${skippedCount} skipped`
    );

    return {
      migrated: migratedCount,
      skipped: skippedCount,
      total: availabilitiesToMigrate.length,
    };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

/**
 * Optional: Make interviewDateId required after migration is complete
 * This will ensure new records must have an interviewDateId
 */
export async function makeInterviewDateIdRequired() {
  console.log("Making interviewDateId required...");

  // This would require a separate migration to alter the column
  console.log("To make interviewDateId required, you need to:");
  console.log("1. Verify all existing availabilities have been migrated");
  console.log("2. Create a new migration to make interviewDateId NOT NULL");
  console.log("3. Update application code to always provide interviewDateId");
}
