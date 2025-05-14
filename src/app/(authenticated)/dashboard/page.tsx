import { getEvents } from "./actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventCard } from "@/components/dashboard/EventCard";

export default async function Dashboard() {
  const events = await getEvents();

  return (
    <div className="container">
      <div className="w-1/2 h-[50vh]">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Stay updated with our latest events
            </CardDescription>
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
    </div>
  );
}
