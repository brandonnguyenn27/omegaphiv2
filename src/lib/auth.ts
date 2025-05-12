import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "..";
import { user, session, account, verification } from "@/db/auth-schema";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nextCookies } from "better-auth/next-js";
import type { User, Account } from "better-auth";

console.log("Initializing auth configuration...");

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
  plugins: [nextCookies()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    },
  },
  events: {
    async signIn({
      user,
      account,
      profile: oauthProfile,
    }: {
      user: User;
      account: Account;
      profile: any;
    }) {
      console.log("SignIn event triggered");
      console.log("User data:", user);
      console.log("Account data:", account);
      console.log("OAuth profile:", oauthProfile);

      try {
        const existingProfile = await db.query.profile.findFirst({
          where: eq(profile.id, user.id),
        });
        console.log("Existing profile check result:", existingProfile);

        // If no profile exists, create one
        if (!existingProfile) {
          console.log("Creating new profile for user:", user.id);
          await db.insert(profile).values({
            id: user.id,
            name: user.name,
            email: user.email,
            role: "member",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log("Profile created successfully");
        }
        console.log("SignIn event completed successfully");
      } catch (error) {
        console.error("Error in signIn event:", error);
      }
    },
  },
});
