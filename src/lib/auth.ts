import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "..";
import { user, session, account, verification } from "@/db/auth-schema";
import { whitelist } from "@/db/schema";
import { eq } from "drizzle-orm";

console.log("Initializing auth configuration...");

// Function to check if an email is whitelisted
export async function isEmailWhitelisted(email: string): Promise<boolean> {
  try {
    const result = await db
      .select()
      .from(whitelist)
      .where(eq(whitelist.email, email))
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error("Error checking whitelist:", error);
    return false;
  }
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    },
  },
});
