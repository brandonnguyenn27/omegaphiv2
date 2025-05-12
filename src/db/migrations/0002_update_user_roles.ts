import { sql } from "drizzle-orm";
import { user } from "../auth-schema";

export async function up(db: any) {
  await db
    .update(user)
    .set({ role: "member" })
    .where(sql`role IS NULL`);
}

export async function down(db: any) {
  // No down migration needed as we're setting a default value
}
