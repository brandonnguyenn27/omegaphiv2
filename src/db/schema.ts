import {
  text,
  sqliteTable,
  integer,
  primaryKey,
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
