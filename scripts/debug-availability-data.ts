#!/usr/bin/env tsx

import { db } from "../src/index";
import {
  userAvailabilities,
  rusheeAvailabilities,
  interviewDates,
} from "../src/db/schema";
import { eq, isNotNull, isNull } from "drizzle-orm";

async function debugAvailabilityData() {
  console.log("🔍 Debugging availability data...");
  console.log("");

  try {
    // Get all interview dates
    const allInterviewDates = await db.select().from(interviewDates);
    console.log("📅 Interview Dates:");
    allInterviewDates.forEach((id) => {
      console.log(`  - ${id.id}: ${id.date.toISOString()}`);
    });
    console.log("");

    // Get user availabilities
    const userAvails = await db.select().from(userAvailabilities);
    console.log("👤 User Availabilities:");
    userAvails.forEach((ua, index) => {
      console.log(`  ${index + 1}. ID: ${ua.id}`);
      console.log(`     User ID: ${ua.userId}`);
      console.log(`     Interview Date ID: ${ua.interviewDateId || "NULL"}`);
      console.log(`     Date: ${ua.date?.toISOString() || "NULL"}`);
      console.log(`     Start: ${ua.startTime?.toISOString() || "NULL"}`);
      console.log(`     End: ${ua.endTime?.toISOString() || "NULL"}`);
      console.log(`     Created: ${ua.createdAt.toISOString()}`);
      console.log("");
    });

    // Get rushee availabilities
    const rusheeAvails = await db.select().from(rusheeAvailabilities);
    console.log("🎓 Rushee Availabilities:");
    rusheeAvails.forEach((ra, index) => {
      console.log(`  ${index + 1}. ID: ${ra.id}`);
      console.log(`     Rushee ID: ${ra.rusheeId}`);
      console.log(`     Interview Date ID: ${ra.interviewDateId || "NULL"}`);
      console.log(`     Date: ${ra.date?.toISOString() || "NULL"}`);
      console.log(`     Start: ${ra.startTime?.toISOString() || "NULL"}`);
      console.log(`     End: ${ra.endTime?.toISOString() || "NULL"}`);
      console.log(`     Created: ${ra.createdAt.toISOString()}`);
      console.log("");
    });

    // Check for problematic records
    console.log("⚠️  Problematic Records:");

    // User availabilities with 1970 dates
    const userWith1970 = userAvails.filter(
      (ua) => ua.startTime && ua.startTime.getFullYear() === 1970
    );
    console.log(
      `  - User availabilities with 1970 dates: ${userWith1970.length}`
    );

    // User availabilities with mismatched dates
    const userMismatched = userAvails.filter(
      (ua) =>
        ua.date &&
        ua.startTime &&
        ua.date.toISOString().split("T")[0] !==
          ua.startTime.toISOString().split("T")[0]
    );
    console.log(
      `  - User availabilities with mismatched dates: ${userMismatched.length}`
    );

    // User availabilities without interview date ID
    const userWithoutInterviewDate = userAvails.filter(
      (ua) => !ua.interviewDateId
    );
    console.log(
      `  - User availabilities without interview date ID: ${userWithoutInterviewDate.length}`
    );

    // Rushee availabilities without interview date ID
    const rusheeWithoutInterviewDate = rusheeAvails.filter(
      (ra) => !ra.interviewDateId
    );
    console.log(
      `  - Rushee availabilities without interview date ID: ${rusheeWithoutInterviewDate.length}`
    );

    console.log("");
    console.log("✅ Debug completed!");
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

debugAvailabilityData();
