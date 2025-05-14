import { config } from "dotenv";
import { db } from "@/index";
import { events } from "./schema";
import { join } from "path";

// Load environment variables from the root .env file
config({ path: join(process.cwd(), ".env") });

async function seed() {
  try {
    const testEvents = [
      {
        id: crypto.randomUUID(),
        name: "AKPsi Social Mixer",
        description:
          "Join us for a fun evening of networking and socializing with fellow brothers!",
        date: new Date("2024-04-15"),
        time: new Date("2024-04-15T18:00:00"),
        location: "Student Center Room 101",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Professional Development Workshop",
        description:
          "Learn essential skills for your career development. Topics include resume building, interview preparation, and networking strategies.",
        date: new Date("2024-04-20"),
        time: new Date("2024-04-20T14:00:00"),
        location: "Business School Room 302",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Community Service Day",
        description:
          "Join us in giving back to our community. We'll be volunteering at the local food bank and organizing donations.",
        date: new Date("2024-04-25"),
        time: new Date("2024-04-25T10:00:00"),
        location: "Community Center",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Alumni Networking Event",
        description:
          "Connect with AKPsi alumni from various industries. Great opportunity for mentorship and career advice.",
        date: new Date("2024-05-01"),
        time: new Date("2024-05-01T17:30:00"),
        location: "Downtown Conference Center",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Spring Social",
        description:
          "End of semester celebration with games, food, and fun activities. All brothers welcome!",
        date: new Date("2024-05-05"),
        time: new Date("2024-05-05T16:00:00"),
        location: "Campus Quad",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Leadership Retreat",
        description:
          "Annual leadership retreat for chapter officers and committee chairs. Team building and strategic planning for the upcoming semester.",
        date: new Date("2024-05-10"),
        time: new Date("2024-05-10T09:00:00"),
        location: "Mountain View Lodge",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.insert(events).values(testEvents);
    console.log("Successfully seeded test events!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
