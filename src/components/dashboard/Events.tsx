import { EventCard } from "./EventCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { events } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Event = InferSelectModel<typeof events>;

export default function Events({ events }: { events: Event[] }) {
  return (
    <div className="h-[50vh]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none">
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Stay updated with our latest events</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {events.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              There are no upcoming events
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
