"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RusheeAvailabilityExtended,
  UserAvailabilityExtended,
  InterviewDate,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { createInterviewAssignment } from "@/app/(authenticated)/(admin)/admin/interview-scheduler/actions";
import { format } from "date-fns";

interface SchedulePopoverProps {
  rusheeAvailabilities: RusheeAvailabilityExtended[];
  userAvailabilities: UserAvailabilityExtended[];
  isAvailable: boolean;
  slot: Date;
  rusheeId: string;
  interviewDate: InterviewDate | undefined;
}

export default function SchedulePopover({
  userAvailabilities,
  slot,
  rusheeId,
  interviewDate,
}: SchedulePopoverProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (user_id: string, checked: boolean) => {
    if (checked) {
      if (selectedUsers.length < 2) {
        setSelectedUsers((prev) => [...prev, user_id]);
        setError(""); // Clear error when user selects someone
      }
    } else {
      setSelectedUsers((prev) => prev.filter((uid) => uid !== user_id));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedUsers.length !== 2) {
      setError("Please select exactly 2 users.");
      return;
    }

    if (!interviewDate) {
      setError("Interview date not found.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("slot", slot.toISOString());
      formData.append("rusheeId", rusheeId);
      formData.append("interviewDateId", interviewDate.id);
      formData.append("selectedUsers", JSON.stringify(selectedUsers));

      const result = await createInterviewAssignment(formData);

      if (result.success) {
        // Close the popover by resetting state
        setSelectedUsers([]);
        setError("");
        // The page will revalidate automatically due to revalidatePath in the action
      } else {
        setError(result.message || "Failed to create interview assignment");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error submitting interview assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div
            key={`${rusheeId}-${slot}`}
            className="border-b border-r border-gray-300 h-12 flex items-center justify-center text-xs transition-colors duration-200 bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          >
            Available
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <h3 className="font-semibold text-lg mb-2">Schedule Interview</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {(() => {
              // Convert UTC slot to local time for display
              const year = slot.getUTCFullYear();
              const month = slot.getUTCMonth();
              const day = slot.getUTCDate();
              const hour = slot.getUTCHours();
              const minute = slot.getUTCMinutes();
              const localDate = new Date(year, month, day, hour, minute);

              return format(localDate, "MMM dd, yyyy 'at' h:mm a");
            })()}
          </p>

          {userAvailabilities.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <p className="mb-4 text-sm">Select 2 interviewers:</p>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {userAvailabilities
                  .sort((a, b) => {
                    const nameA =
                      a.user?.name || a.user?.email || "Unknown User";
                    const nameB =
                      b.user?.name || b.user?.email || "Unknown User";
                    return nameA.localeCompare(nameB);
                  })
                  .map((ua) => {
                    const isChecked = selectedUsers.includes(ua.userId);
                    const isDisabled = !isChecked && selectedUsers.length >= 2;

                    return (
                      <div key={ua.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${ua.userId}`}
                          checked={isChecked}
                          disabled={isDisabled}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              ua.userId,
                              typeof checked === "boolean" ? checked : false
                            )
                          }
                        />
                        <label
                          htmlFor={`user-${ua.userId}`}
                          className={`text-sm ${
                            isDisabled ? "text-gray-400" : "cursor-pointer"
                          }`}
                        >
                          {ua.user?.name || ua.user?.email || "Unknown User"}
                        </label>
                      </div>
                    );
                  })}
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {selectedUsers.length}/2 selected
                </span>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedUsers.length !== 2}
                  className="px-4 py-2"
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Interview"}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              No interviewers available in this timeslot.
            </p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
