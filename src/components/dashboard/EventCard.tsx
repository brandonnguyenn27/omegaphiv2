import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { events } from "@/db/schema";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

type Event = typeof events.$inferSelect;

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Collapsible>
      <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
        <CardContent className="p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium truncate">
                  {event.name}
                </CardTitle>
                <CardDescription className="text-xs shrink-0">
                  {format(new Date(event.date), "MMM d")} at{" "}
                  {format(new Date(event.time), "h:mm a")}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {event.location && (
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  📍 {event.location}
                </span>
              )}
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer hover:border hover:border-muted-foreground/20"
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      "group-data-[state=open]:rotate-180"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            <div className="mt-3 pt-3 border-t space-y-2">
              <div className="text-sm">
                <p className="font-bold mb-1">{event.name}</p>
                <p className="font-medium">Date & Time</p>
                <p className="text-muted-foreground">
                  {format(new Date(event.date), "MMMM d, yyyy")} at{" "}
                  {format(new Date(event.time), "h:mm a")}
                </p>
              </div>
              {event.description && (
                <div className="text-sm">
                  <p className="font-medium">Description</p>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
              )}
              {event.location && (
                <div className="text-sm">
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">📍 {event.location}</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
