#!/usr/bin/env tsx

import { runAvailabilityDateFix } from "../src/db/migrations/fix_user_availability_dates";

async function main() {
  console.log("🔧 Running availability date fix migration...");
  console.log(
    "This will fix user and rushee availability dates that have 1970-01-01 instead of actual interview dates."
  );
  console.log("");

  try {
    const result = await runAvailabilityDateFix();

    console.log("");
    console.log("📊 Migration Results:");
    console.log("===================");

    if (result.userResult.success) {
      console.log(
        `✅ User availabilities: Fixed ${result.userResult.fixed}, Skipped ${result.userResult.skipped}`
      );
    } else {
      console.log(`❌ User availabilities failed: ${result.userResult.error}`);
    }

    if (result.rusheeResult.success) {
      console.log(
        `✅ Rushee availabilities: Fixed ${result.rusheeResult.fixed}, Skipped ${result.rusheeResult.skipped}`
      );
    } else {
      console.log(
        `❌ Rushee availabilities failed: ${result.rusheeResult.error}`
      );
    }

    if (result.userResult.success && result.rusheeResult.success) {
      console.log("");
      console.log("🎉 Migration completed successfully!");
      console.log(
        "You can now refresh the interview scheduler page to see clickable time slots."
      );
      process.exit(0);
    } else {
      console.log("");
      console.log("❌ Migration had errors. Please check the logs above.");
      process.exit(1);
    }
  } catch (error) {
    console.error("");
    console.error("💥 Migration failed with error:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

main();
