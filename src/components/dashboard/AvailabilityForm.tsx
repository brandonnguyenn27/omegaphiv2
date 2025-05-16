"use client";

import { useActionState, useEffect } from "react";

import { addAvailability } from "@/app/(authenticated)/dashboard/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ActionResponse } from "@/app/(authenticated)/dashboard/actions";
import { useQuery } from "@tanstack/react-query";
import { getInterviewDates } from "@/app/(authenticated)/dashboard/actions";
import SkeletonFormCard from "../loading/skeleton";
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

const initialState: ActionResponse = {
  success: false,
  message: "",
};

interface AvailabilityFormProps {
  onSubmissionSuccess: () => void;
}

export default function AvailabilityForm({
  onSubmissionSuccess,
}: AvailabilityFormProps) {
  const [state, action, isPending] = useActionState(
    addAvailability,
    initialState
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (state.success) {
      timeoutId = setTimeout(() => {
        onSubmissionSuccess();
      }, 500);
    }
  }, [state, onSubmissionSuccess]);

  const {
    data: interviewDates,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["interviewDates"],
    queryFn: getInterviewDates,
  });

  if (isLoading) {
    return <SkeletonFormCard />;
  }
  if (isError) {
    return (
      <div className="text-red-500">
        Error fetching interview dates: {error.message}
      </div>
    );
  }

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
        <form action={action}>
          <div className=" gap-4 flex flex-col">
            <div>
              <input
                type="hidden"
                name="date"
                value={state?.values?.date || ""}
                id="date-input"
              />
              <Select
                name="dateSelect"
                defaultValue={state?.values?.date || ""}
                onValueChange={(value) => {
                  const hiddenInput = document.getElementById(
                    "date-input"
                  ) as HTMLInputElement;
                  if (hiddenInput) {
                    hiddenInput.value = value;
                  }
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
            <div>
              <Input
                name="startTime"
                type="time"
                defaultValue={state?.values?.startTime || ""}
                required
                className={state?.errors?.startTime ? "border-red-500" : ""}
              />
              {state?.errors?.startTime && (
                <p id="start-error" className="text-sm text-red-500">
                  {state.errors.startTime[0]}
                </p>
              )}
            </div>
            <div>
              <Input
                name="endTime"
                type="time"
                defaultValue={state?.values?.endTime || ""}
                required
                className={state?.errors?.endTime ? "border-red-500" : ""}
              />
              {state?.errors?.endTime && (
                <p id="end-error" className="text-sm text-red-500">
                  {state.errors.endTime[0]}
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
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
