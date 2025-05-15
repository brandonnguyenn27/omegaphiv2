import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { userAvailabilities } from "@/db/schema";

type UserAvailabilities = InferSelectModel<typeof userAvailabilities>;

export default function AvailabilityComponent({
  availabilities,
}: {
  availabilities: UserAvailabilities[];
}) {
  return (
    <div className="h-[50vh]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Your interview availability</CardDescription>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="cursor-pointer border-1 border-gray-400 border-opacity-50"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-2">
          {availabilities.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50 rounded-md">
              You have no availability set. Click the plus icon to add one.
            </div>
          ) : (
            <div>
              {availabilities.map((availability) => (
                <AvailabilityCard
                  key={availability.id}
                  availability={availability}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AvailabilityCard({
  availability,
}: {
  availability: UserAvailabilities;
}) {
  return (
    <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
      <CardContent className="p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">
                {format(new Date(availability.date), "MMM d")}
              </CardTitle>
              <CardDescription className="text-xs">
                {format(new Date(availability.startTime), "h:mm a")} -{" "}
                {format(new Date(availability.endTime), "h:mm a")}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
