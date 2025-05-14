import {
  text,
  sqliteTable,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  time: integer("time", { mode: "timestamp" }).notNull(),
  location: text("location"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Table for available interview dates
export const interviewDates = sqliteTable("interview_dates", {
  id: text("id").primaryKey(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Table for user availabilities
export const userAvailabilities = sqliteTable(
  "user_availabilities",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(), // References your users table
    date: integer("date", { mode: "timestamp" }).notNull(),
    startTime: integer("start_time", { mode: "timestamp" }).notNull(),
    endTime: integer("end_time", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    // Index for querying by user
    userIdx: index("user_availabilities_user_idx").on(table.userId),
  })
);
