import { text, sqliteTable, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

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
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // New field - references interview dates
    interviewDateId: text("interview_date_id").references(
      () => interviewDates.id,
      { onDelete: "cascade" }
    ),
    // Legacy fields - will be removed after migration
    date: integer("date", { mode: "timestamp" }),
    startTime: integer("start_time", { mode: "timestamp" }),
    endTime: integer("end_time", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    // Index for querying by user
    userIdx: index("user_availabilities_user_idx").on(table.userId),
    // Index for querying by interview date
    interviewDateIdx: index("user_availabilities_interview_date_idx").on(
      table.interviewDateId
    ),
  })
);

// Table for rushees (potential new members)
export const rushee = sqliteTable("rushee", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"),
  major: text("major"),
  interviewScheduled: integer("interview_scheduled", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Table for rushee availabilities
export const rusheeAvailabilities = sqliteTable(
  "rushee_availabilities",
  {
    id: text("id").primaryKey(),
    rusheeId: text("rushee_id")
      .notNull()
      .references(() => rushee.id, { onDelete: "cascade" }),
    interviewDateId: text("interview_date_id").references(
      () => interviewDates.id,
      { onDelete: "cascade" }
    ),
    // Legacy fields - kept for consistency with userAvailabilities
    date: integer("date", { mode: "timestamp" }),
    startTime: integer("start_time", { mode: "timestamp" }),
    endTime: integer("end_time", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    // Index for querying by rushee
    rusheeIdx: index("rushee_availabilities_rushee_idx").on(table.rusheeId),
    // Index for querying by interview date
    interviewDateIdx: index("rushee_availabilities_interview_date_idx").on(
      table.interviewDateId
    ),
  })
);

// Table for interview assignments
export const interviewAssignments = sqliteTable(
  "interview_assignments",
  {
    id: text("id").primaryKey(),
    rusheeId: text("rushee_id")
      .notNull()
      .references(() => rushee.id, { onDelete: "cascade" }),
    interviewDateId: text("interview_date_id")
      .notNull()
      .references(() => interviewDates.id, { onDelete: "cascade" }),
    startTime: integer("start_time", { mode: "timestamp" }).notNull(),
    endTime: integer("end_time", { mode: "timestamp" }).notNull(),
    interviewer1Id: text("interviewer1_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    interviewer2Id: text("interviewer2_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    // Index for querying by rushee
    rusheeIdx: index("interview_assignments_rushee_idx").on(table.rusheeId),
    // Index for querying by interview date
    interviewDateIdx: index("interview_assignments_interview_date_idx").on(
      table.interviewDateId
    ),
    // Index for querying by interviewers
    interviewer1Idx: index("interview_assignments_interviewer1_idx").on(
      table.interviewer1Id
    ),
    interviewer2Idx: index("interview_assignments_interviewer2_idx").on(
      table.interviewer2Id
    ),
  })
);

// Table for email whitelist
export const whitelist = sqliteTable("whitelist", {
  email: text("email").primaryKey(),
});
