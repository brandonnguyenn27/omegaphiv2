"use client";

import { useActionState, useEffect } from "react";

import { addAvailability } from "@/app/(authenticated)/dashboard/actions";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ActionResponse } from "@/app/(authenticated)/dashboard/actions";

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
    if (state.success) {
      onSubmissionSuccess();
    }
  }, [state, onSubmissionSuccess]);

  return (
    <Card>
      <CardContent>
        <form action={action}>
          <div className="m-2 gap-2 flex flex-col">
            <div>
              <Input
                name="date"
                type="date"
                defaultValue={state?.values?.date || ""}
                required
                className={state?.errors?.date ? "border-red-500" : ""}
              />
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
