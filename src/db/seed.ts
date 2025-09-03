import { db } from "@/index";
import { interviewDates, whitelist, events } from "./schema";
import { v4 as uuidv4 } from "uuid";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), ".env") });

async function seedEvents() {
  console.log("Seeding events...");

  const eventNames = [
    "Meet The Chapter",
    "LinkedIn & Resume Night",
    "Alumni Night",
    "Game Night",
  ];

  const eventEntries = [
    {
      name: eventNames[0],
      date: new Date(Date.UTC(2025, 7, 28)), // August 28, 2025 UTC
      time: new Date(Date.UTC(2025, 7, 28, 21, 0, 0)), // August 28, 2025 at 9:00 PM UTC
    },
    {
      name: eventNames[1],
      date: new Date(Date.UTC(2025, 8, 2)), // September 2, 2025 UTC
      time: new Date(Date.UTC(2025, 8, 2, 21, 0, 0)), // September 2, 2025 at 9:00 PM UTC
    },
    {
      name: eventNames[2],
      date: new Date(Date.UTC(2025, 8, 4)), // September 4, 2025 UTC
      time: new Date(Date.UTC(2025, 8, 4, 21, 0, 0)), // September 4, 2025 at 9:00 PM UTC
    },
    {
      name: eventNames[3],
      date: new Date(Date.UTC(2025, 8, 9)), // September 9, 2025 UTC
      time: new Date(Date.UTC(2025, 8, 9, 21, 0, 0)), // September 9, 2025 at 9:00 PM UTC
    },
  ].map((event) => {
    // Create a time-only date that represents 9:00 PM UTC
    const timeOnly = new Date(Date.UTC(1970, 0, 1, 21, 0, 0)); // 9:00 PM UTC

    return {
      id: uuidv4(),
      name: event.name,
      description: null,
      date: event.date,
      time: timeOnly, // Use the time-only date in UTC
      location: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  try {
    // Use onConflictDoNothing to avoid duplicate errors
    await db.insert(events).values(eventEntries).onConflictDoNothing();
    console.log("Events seeded successfully!");
  } catch (error) {
    console.error("Error seeding events:", error);
  }
}

async function seedInterviewDates() {
  console.log("Seeding interview dates...");

  // Create dates in UTC to ensure consistency across environments
  const datesToSeed = [
    new Date(Date.UTC(2025, 8, 12)), // September 12, 2025 UTC (month is 0-indexed)
    new Date(Date.UTC(2025, 8, 13)), // September 13, 2025 UTC
    new Date(Date.UTC(2025, 8, 14)), // September 14, 2025 UTC
  ];

  // First two dates: 9 AM - 2 PM UTC
  const earlyStartTime = new Date(Date.UTC(1970, 0, 1, 9, 0, 0)); // 9:00 AM UTC
  const earlyEndTime = new Date(Date.UTC(1970, 0, 1, 14, 0, 0)); // 2:00 PM UTC

  // Last date: 12 PM - 8 PM UTC
  const lateStartTime = new Date(Date.UTC(1970, 0, 1, 12, 0, 0)); // 12:00 PM UTC
  const lateEndTime = new Date(Date.UTC(1970, 0, 1, 20, 0, 0)); // 8:00 PM UTC

  const interviewDateEntries = datesToSeed.map((date, index) => {
    const startTime = index < 2 ? earlyStartTime : lateStartTime;
    const endTime = index < 2 ? earlyEndTime : lateEndTime;

    return {
      id: uuidv4(),
      date: date,
      startTime: startTime,
      endTime: endTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  try {
    // Use onConflictDoNothing to avoid duplicate errors
    await db
      .insert(interviewDates)
      .values(interviewDateEntries)
      .onConflictDoNothing();
    console.log("Interview dates seeded successfully!");
  } catch (error) {
    console.error("Error seeding interview dates:", error);
  }
}

async function seedWhitelist() {
  console.log("Seeding whitelist...");

  const emails = [
    "aashna.chadda.api@gmail.com",
    "alina.nguyen.api@gmail.com",
    "amogh.kuchibhotla.ao@gmail.com",
    "anthony.dang.am@gmail.com",
    "ariana.vermeulen.api@gmail.com",
    "arya.s.patel.ao@gmail.com",
    "brandon.nguyen.ao@gmail.com",
    "correy.le.api@gmail.com",
    "curtis.ng.api@gmail.com",
    "denzel.chima.ao@gmail.com",
    "dhanesh.manda.ao@gmail.com",
    "donovan.putthongvilai.api@gmail.com",
    "emily.dang.axi@gmail.com",
    "enzo.teddy.ao@gmail.com",
    "fellip.oflas.api@gmail.com",
    "gia.mitra.axi@gmail.com",
    "huy.n.vu.ao@gmail.com",
    "jade.j.lee.ao@gmail.com",
    "jaelyn.chen.ao@gmail.com",
    "Jenny.zhu.ao@gmail.com",
    "jiya.patel.ao@gmail.com",
    "josephine.yu.ao@gmail.com",
    "kevin.huynh.axi@gmail.com",
    "khaai.pham.an@gmail.com",
    "lynsey.chau.an@gmail.com",
    "michael.a.figueroa.ao@gmail.com",
    "michael.vo.api@gmail.com",
    "nicholas.soukchareon.axi@gmail.com",
    "Raymond.lei.axi@gmail.com",
    "robinson.doan.axi@gmail.com",
    "rogan.souter.axi@gmail.com",
    "roger.huynh.ao@gmail.com",
    "ryan.pham.api@gmail.com",
    "salvador.g.elisondo.axi@gmail.com",
    "shawn.m.roxas.ao@gmail.com",
    "shreya.jayakumar.ao@gmail.com",
    "teluun.baterdene.ao@gmail.com",
    "andrian.than.api@gmail.com",
    "thomson.troung.api@gmail.com",
    "veronika.kudriavtceva.ao@gmail.com",
    "wesley.kieu.an@gmail.com",
  ];

  const whitelistEntries = emails.map((email) => ({
    email: email,
  }));

  try {
    // Use onConflictDoNothing to avoid duplicate errors
    await db.insert(whitelist).values(whitelistEntries).onConflictDoNothing();
    console.log("Whitelist seeded successfully!");
  } catch (error) {
    console.error("Error seeding whitelist:", error);
  }
}

async function main() {
  await seedEvents();
  await seedInterviewDates();
  await seedWhitelist();
  console.log("All seeding completed!");
}

main();
