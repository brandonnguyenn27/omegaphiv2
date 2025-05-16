import { db } from "@/index";
import { interviewDates } from "./schema";
import { v4 as uuidv4 } from "uuid";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), ".env") });

async function seedInterviewDates() {
  console.log("Seeding interview dates...");

  const datesToSeed = [
    new Date("2025-08-31"),
    new Date("2025-09-01"),
    new Date("2025-09-02"),
  ];

  const startTime = new Date();
  startTime.setHours(10, 0, 0, 0);

  const endTime = new Date();
  endTime.setHours(14, 0, 0, 0);

  const interviewDateEntries = datesToSeed.map((date) => ({
    id: uuidv4(),
    date: date,
    startTime: startTime,
    endTime: endTime,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  try {
    await db.insert(interviewDates).values(interviewDateEntries);
    console.log("Interview dates seeded successfully!");
  } catch (error) {
    console.error("Error seeding interview dates:", error);
  } finally {
  }
}

seedInterviewDates();
