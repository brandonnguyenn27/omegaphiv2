"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  RusheeAvailabilityExtended,
  UserAvailabilityExtended,
  InterviewDate,
  InterviewAssignmentExtended,
} from "@/lib/types";
import SchedulePopover from "@/components/interview-scheduler/SchedulePopover";
import { deleteInterviewAssignment } from "@/app/(authenticated)/(admin)/admin/interview-scheduler/actions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimeSlotCellProps {
  isAvailable: boolean;
  rusheeAvailabilities: RusheeAvailabilityExtended[];
  userAvailabilities: UserAvailabilityExtended[];
  slot: Date;
  rusheeId: string;
  interviewDate: InterviewDate | undefined;
  scheduled: boolean;
  existingAssignment?: InterviewAssignmentExtended;
}

interface ScheduledCellProps {
  existingAssignment?: InterviewAssignmentExtended;
  title: string;
  bgColor: string;
}

const ScheduledCell: React.FC<ScheduledCellProps> = ({
  existingAssignment,
  title,
  bgColor,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!existingAssignment) return;

    setIsDeleting(true);
    try {
      const result = await deleteInterviewAssignment(existingAssignment.id);
      if (!result.success) {
        console.error("Failed to delete assignment:", result.message);
      }
      // The page will revalidate automatically
    } catch (error) {
      console.error("Error deleting assignment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`border-b border-r border-gray-300 h-12 flex items-center justify-center text-xs transition-colors duration-200 ${bgColor} text-white cursor-pointer hover:bg-green-600`}
          title={title}
        >
          {existingAssignment &&
            existingAssignment.interviewer1 &&
            existingAssignment.interviewer2 && (
              <div className="text-center">
                <div className="text-xs font-medium">
                  {existingAssignment.interviewer1.name} &{" "}
                  {existingAssignment.interviewer2.name}
                </div>
              </div>
            )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-2"
        align="center"
        side="top"
        sideOffset={5}
        avoidCollisions={true}
        collisionPadding={20}
        sticky="always"
      >
        <div className="space-y-1">
          <p className="text-xs font-medium text-center">Remove assignment?</p>

          {existingAssignment && (
            <div className="text-xs text-center text-muted-foreground">
              <p className="truncate">
                {existingAssignment.interviewer1?.name} &{" "}
                {existingAssignment.interviewer2?.name}
              </p>
              <p>
                {(() => {
                  // Convert UTC time to local time for display
                  const startTime = existingAssignment.startTime;
                  const year = startTime.getUTCFullYear();
                  const month = startTime.getUTCMonth();
                  const day = startTime.getUTCDate();
                  const hour = startTime.getUTCHours();
                  const minute = startTime.getUTCMinutes();
                  const localDate = new Date(year, month, day, hour, minute);
                  return format(localDate, "MMM dd, h:mm a");
                })()}
              </p>
            </div>
          )}

          <div className="flex gap-1 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-6 text-xs px-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 h-6 text-xs px-1"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "..." : "Remove"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  isAvailable,
  rusheeAvailabilities,
  userAvailabilities,
  slot,
  rusheeId,
  interviewDate,
  scheduled,
  existingAssignment,
}) => {
  const title = isAvailable
    ? rusheeAvailabilities
        .map(
          (a) =>
            `Available: ${format(new Date(a.startTime!), "p")} - ${format(
              new Date(a.endTime!),
              "p"
            )}`
        )
        .join("\n")
    : "";

  let bgColor = "bg-gray-100";
  if (scheduled) {
    bgColor = "bg-green-500";
  }

  if (scheduled) {
    return (
      <ScheduledCell
        key={`${rusheeId}-${slot}`}
        existingAssignment={existingAssignment}
        title={title}
        bgColor={bgColor}
      />
    );
  }

  if (isAvailable) {
    return (
      <SchedulePopover
        rusheeAvailabilities={rusheeAvailabilities}
        userAvailabilities={userAvailabilities}
        isAvailable={isAvailable}
        slot={slot}
        rusheeId={rusheeId}
        interviewDate={interviewDate}
      />
    );
  }

  return (
    <div
      key={`${rusheeId}-${slot}`}
      className={`border-b border-r border-gray-300 h-12 flex items-center justify-center text-xs transition-colors duration-200 ${bgColor}`}
      title={title}
    />
  );
};

export default TimeSlotCell;
