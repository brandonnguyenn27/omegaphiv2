import { db } from "@/index";
import { rushee, rusheeAvailabilities } from "@/db/schema";

export default async function RusheeAvailabilitiesPage() {
  // Fetch all rushees
  const allRushees = await db.select().from(rushee).orderBy(rushee.name);

  // Fetch all availabilities
  const allAvailabilities = await db
    .select()
    .from(rusheeAvailabilities)
    .orderBy(rusheeAvailabilities.date);

  // Group availabilities by rushee ID
  const availabilitiesByRushee = allAvailabilities.reduce(
    (acc, availability) => {
      if (!acc[availability.rusheeId]) {
        acc[availability.rusheeId] = [];
      }
      acc[availability.rusheeId].push(availability);
      return acc;
    },
    {} as Record<string, typeof allAvailabilities>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Rushee Availabilities
          </h1>
          <p className="text-muted-foreground">
            View all rushee availability schedules.
          </p>
        </div>

        {allRushees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No rushees found.
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      Rushee
                    </th>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      Phone
                    </th>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      Major
                    </th>
                    <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                      Availabilities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allRushees.map((rusheeData) => {
                    const availabilities =
                      availabilitiesByRushee[rusheeData.id] || [];

                    return (
                      <tr key={rusheeData.id} className="border-b">
                        <td className="p-2 align-middle font-medium">
                          {rusheeData.name}
                        </td>
                        <td className="p-2 align-middle text-sm text-muted-foreground">
                          {rusheeData.email}
                        </td>
                        <td className="p-2 align-middle text-sm text-muted-foreground">
                          {rusheeData.phoneNumber || "—"}
                        </td>
                        <td className="p-2 align-middle text-sm text-muted-foreground">
                          {rusheeData.major || "—"}
                        </td>
                        <td className="p-2 align-middle text-sm">
                          {availabilities.length === 0 ? (
                            <span className="text-muted-foreground">None</span>
                          ) : (
                            <div className="space-y-1">
                              {availabilities.map((availability) => {
                                // Debug logging for timestamp conversion
                                console.log("Frontend availability debug:", {
                                  id: availability.id,
                                  rawDate: availability.date,
                                  rawStartTime: availability.startTime,
                                  rawEndTime: availability.endTime,
                                  dateObj: availability.date
                                    ? new Date(availability.date)
                                    : null,
                                  startTimeObj: availability.startTime
                                    ? new Date(availability.startTime)
                                    : null,
                                  endTimeObj: availability.endTime
                                    ? new Date(availability.endTime)
                                    : null,
                                });

                                return (
                                  <div
                                    key={availability.id}
                                    className="text-xs"
                                  >
                                    <span className="font-medium">
                                      {availability.date
                                        ? new Date(
                                            availability.date
                                          ).toLocaleDateString()
                                        : "—"}
                                    </span>
                                    {availability.startTime &&
                                      availability.endTime && (
                                        <span className="text-muted-foreground ml-1">
                                          {new Date(
                                            availability.startTime
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            timeZone: "UTC", // Force UTC display
                                          })}{" "}
                                          -{" "}
                                          {new Date(
                                            availability.endTime
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
