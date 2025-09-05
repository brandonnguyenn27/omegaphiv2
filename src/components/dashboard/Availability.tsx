"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InferSelectModel } from "drizzle-orm";
import { userAvailabilities, interviewDates } from "@/db/schema";
import AvailabilityDialog from "./AvailabilityDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { deleteAvailability } from "@/app/(authenticated)/(user)/dashboard/actions";
import { Loader2, Trash } from "lucide-react";
import { formatTimeUTC, formatDateForDisplay } from "@/utils/helpers";

type UserAvailabilities = InferSelectModel<typeof userAvailabilities>;
type InterviewDates = InferSelectModel<typeof interviewDates>;

export default function AvailabilityComponent({
  availabilities,
  interviewDates,
}: {
  availabilities: UserAvailabilities[];
  interviewDates: InterviewDates[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="h-[50vh]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Your interview availability</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleOpenDialog}>
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
            <div className="flex flex-col gap-2">
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

      <AvailabilityDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        interviewDates={interviewDates}
      />
    </div>
  );
}

function AvailabilityCard({
  availability,
}: {
  availability: UserAvailabilities;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAvailability(availability.id, availability.userId);
    } catch (error) {
      console.error("Failed to delete availability:", error);
      setIsDeleting(false);
    }
  };

  return (
    <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
      <CardContent className="p-2 pl-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">
                {availability.date
                  ? formatDateForDisplay(availability.date)
                  : "No date"}
              </CardTitle>
              <CardDescription className="text-xs">
                {availability.startTime && availability.endTime
                  ? `${formatTimeUTC(availability.startTime)} - ${formatTimeUTC(
                      availability.endTime
                    )}`
                  : "No time set"}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="cursor-pointer mr-2"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
