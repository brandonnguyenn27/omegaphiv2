"use client";

import { useActionState, useEffect, useState } from "react";

import { addAvailability } from "@/app/(authenticated)/(user)/dashboard/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ActionResponse } from "@/app/(authenticated)/(user)/dashboard/actions";
import { InferSelectModel } from "drizzle-orm";
import { interviewDates } from "@/db/schema";
import {
  formatDateForDisplay,
  formatDateForValue,
  formatTimeForDisplay,
} from "@/utils/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InterviewDates = InferSelectModel<typeof interviewDates>;

const initialState: ActionResponse = {
  success: false,
  message: "",
};

interface AvailabilityFormProps {
  onSubmissionSuccess: () => void;
  interviewDates: InterviewDates[];
}

export default function AvailabilityForm({
  onSubmissionSuccess,
  interviewDates,
}: AvailabilityFormProps) {
  const [state, action, isPending] = useActionState(
    addAvailability,
    initialState
  );

  // Local state for form validation
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<{
    startTime?: string;
    endTime?: string;
  }>({});

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        onSubmissionSuccess();
      }, 500);
    }
  }, [state, onSubmissionSuccess]);

  // Get the selected interview date object
  const selectedInterviewDate = interviewDates.find(
    (date) => formatDateForValue(date.date) === selectedDate
  );

  // Validation function
  const validateTimes = () => {
    const errors: { startTime?: string; endTime?: string } = {};

    if (!selectedInterviewDate) {
      setValidationErrors(errors);
      return errors;
    }

    // Convert interview times to HH:MM format for comparison using UTC
    const interviewStartTimeStr = new Date(
      selectedInterviewDate.startTime
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC", // Use UTC since database stores UTC times
    });
    const interviewEndTimeStr = new Date(
      selectedInterviewDate.endTime
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC", // Use UTC since database stores UTC times
    });

    // Validate start time if provided
    if (startTime) {
      if (startTime < interviewStartTimeStr) {
        errors.startTime = `Start time must be at or after ${formatTimeForDisplay(
          selectedInterviewDate.startTime
        )}`;
      }
    }

    // Validate end time if provided
    if (endTime) {
      if (endTime > interviewEndTimeStr) {
        errors.endTime = `End time must be at or before ${formatTimeForDisplay(
          selectedInterviewDate.endTime
        )}`;
      }
    }

    // Check if start time is after end time (only if both are provided)
    if (startTime && endTime && startTime >= endTime) {
      errors.endTime = "End time must be after start time";
    }

    setValidationErrors(errors);
    return errors;
  };

  // Handle time changes and validate
  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    // Always validate when start time changes
    setTimeout(() => validateTimes(), 0);
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    // Always validate when end time changes
    setTimeout(() => validateTimes(), 0);
  };

  // Handle form submission with validation
  const handleSubmit = (formData: FormData) => {
    const errors = validateTimes();

    if (Object.keys(errors).length > 0) {
      // Prevent form submission if there are validation errors
      return;
    }

    // Submit the form
    action(formData);
  };

  if (!interviewDates || interviewDates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">
              No Interview Dates Available
            </h3>
            <p className="text-sm text-muted-foreground">
              There are currently no interview dates available for selection.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check back later or contact an administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="text-sm font-medium">Available Interview Slots:</div>
        </CardTitle>
        <CardDescription>
          <ul className="space-y-1 text-sm">
            {interviewDates.map((date) => (
              <li key={date.id}>
                {formatDateForDisplay(date.date)} @{" "}
                {formatTimeForDisplay(date.startTime)} -{" "}
                {formatTimeForDisplay(date.endTime)}
              </li>
            ))}
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <div className=" gap-4 flex flex-col">
            <div>
              <input
                type="hidden"
                name="date"
                value={selectedDate}
                id="date-input"
              />
              <input
                type="hidden"
                name="interviewDateId"
                value={selectedInterviewDate?.id || ""}
                id="interview-date-id-input"
              />
              <Select
                name="dateSelect"
                value={selectedDate}
                onValueChange={(value) => {
                  setSelectedDate(value);
                  const hiddenInput = document.getElementById(
                    "date-input"
                  ) as HTMLInputElement;
                  const interviewDateIdInput = document.getElementById(
                    "interview-date-id-input"
                  ) as HTMLInputElement;

                  if (hiddenInput) {
                    hiddenInput.value = value;
                  }

                  // Update interview date ID
                  const selectedInterviewDate = interviewDates.find(
                    (date) => formatDateForValue(date.date) === value
                  );
                  if (interviewDateIdInput && selectedInterviewDate) {
                    interviewDateIdInput.value = selectedInterviewDate.id;
                  }

                  // Clear times when date changes
                  setStartTime("");
                  setEndTime("");
                  setValidationErrors({});
                }}
              >
                <SelectTrigger
                  className={state?.errors?.date ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {interviewDates.map((interviewDate) => (
                    <SelectItem
                      key={interviewDate.id}
                      value={formatDateForValue(interviewDate.date)}
                    >
                      {formatDateForDisplay(interviewDate.date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.date && (
                <p id="date-error" className="text-sm text-red-500">
                  {state.errors.date[0]}
                </p>
              )}
            </div>

            {selectedInterviewDate && (
              <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 p-3 rounded-md">
                <strong>📅 Selected Interview Date:</strong>{" "}
                {formatDateForDisplay(selectedInterviewDate.date)}
                <br />
                <strong>⏰ Available Time Slot:</strong>{" "}
                {formatTimeForDisplay(selectedInterviewDate.startTime)} -{" "}
                {formatTimeForDisplay(selectedInterviewDate.endTime)}
              </div>
            )}

            <div>
              <Input
                name="startTime"
                type="time"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                required
                className={
                  state?.errors?.startTime || validationErrors.startTime
                    ? "border-red-500"
                    : ""
                }
                disabled={!selectedDate}
              />
              {(state?.errors?.startTime || validationErrors.startTime) && (
                <p id="start-error" className="text-sm text-red-500">
                  {state?.errors?.startTime?.[0] || validationErrors.startTime}
                </p>
              )}
            </div>
            <div>
              <Input
                name="endTime"
                type="time"
                value={endTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                required
                className={
                  state?.errors?.endTime || validationErrors.endTime
                    ? "border-red-500"
                    : ""
                }
                disabled={!selectedDate}
              />
              {(state?.errors?.endTime || validationErrors.endTime) && (
                <p id="end-error" className="text-sm text-red-500">
                  {state?.errors?.endTime?.[0] || validationErrors.endTime}
                </p>
              )}
            </div>

            {state.success && (
              <p className="text-sm text-green-500">{state.message}</p>
            )}
            {state.success === false && state.message && (
              <p className="text-sm text-red-500">{state.message}</p>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={
                isPending ||
                !selectedDate ||
                !startTime ||
                !endTime ||
                Object.keys(validationErrors).length > 0
              }
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
