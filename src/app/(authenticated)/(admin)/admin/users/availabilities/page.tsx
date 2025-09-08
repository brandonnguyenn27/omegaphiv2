import { db } from "@/index";
import { user } from "@/db/auth-schema";
import { userAvailabilities, interviewDates } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function UserAvailabilitiesPage() {
  // Fetch all users
  const allUsers = await db.select().from(user).orderBy(user.name);

  // Fetch all user availabilities with interview dates
  const allAvailabilities = await db
    .select({
      id: userAvailabilities.id,
      userId: userAvailabilities.userId,
      date: userAvailabilities.date,
      startTime: userAvailabilities.startTime,
      endTime: userAvailabilities.endTime,
      interviewDateId: userAvailabilities.interviewDateId,
      interviewDate: interviewDates.date,
      interviewStartTime: interviewDates.startTime,
      interviewEndTime: interviewDates.endTime,
    })
    .from(userAvailabilities)
    .leftJoin(
      interviewDates,
      eq(userAvailabilities.interviewDateId, interviewDates.id)
    )
    .orderBy(userAvailabilities.date);

  // Group availabilities by user ID
  const availabilitiesByUser = allAvailabilities.reduce((acc, availability) => {
    if (!acc[availability.userId]) {
      acc[availability.userId] = [];
    }
    acc[availability.userId].push(availability);
    return acc;
  }, {} as Record<string, typeof allAvailabilities>);

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Availabilities
          </h1>
          <p className="text-muted-foreground">
            View all user availability schedules for interviews.
          </p>
        </div>

        {allUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found.
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      Availabilities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((userData) => {
                    const availabilities =
                      availabilitiesByUser[userData.id] || [];

                    return (
                      <tr key={userData.id} className="border-b">
                        <td className="p-2 align-middle font-medium">
                          {userData.name}
                        </td>
                        <td className="p-2 align-middle text-sm text-muted-foreground">
                          {userData.email}
                        </td>
                        <td className="p-2 align-middle text-sm text-muted-foreground">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              userData.role === "admin"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {userData.role}
                          </span>
                        </td>
                        <td className="p-2 align-middle text-sm">
                          {availabilities.length === 0 ? (
                            <span className="text-muted-foreground">None</span>
                          ) : (
                            <div className="space-y-1">
                              {availabilities.map((availability) => {
                                // Use interview date if available, otherwise fall back to legacy fields
                                const displayDate =
                                  availability.interviewDate ||
                                  availability.date;
                                const displayStartTime =
                                  availability.interviewStartTime ||
                                  availability.startTime;
                                const displayEndTime =
                                  availability.interviewEndTime ||
                                  availability.endTime;

                                return (
                                  <div
                                    key={availability.id}
                                    className="text-xs"
                                  >
                                    <span className="font-medium">
                                      {displayDate
                                        ? new Date(
                                            displayDate
                                          ).toLocaleDateString()
                                        : "—"}
                                    </span>
                                    {displayStartTime && displayEndTime && (
                                      <span className="text-muted-foreground ml-1">
                                        {new Date(
                                          displayStartTime
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          timeZone: "UTC", // Force UTC display
                                        })}{" "}
                                        -{" "}
                                        {new Date(
                                          displayEndTime
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          timeZone: "UTC", // Force UTC display
                                        })}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
