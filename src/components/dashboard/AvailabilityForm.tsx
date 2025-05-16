"use client";

import { useActionState } from "react";

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

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function AvailabilityForm() {
  const [state, action, isPending] = useActionState(
    addAvailability,
    initialState
  );
  return (
    <Card>
      <CardContent>
        <form action={action}>
          <div className="m-2 gap-2 flex flex-col">
            <div>
              <Input
                name="date"
                type="date"
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
                required
                className={state?.errors?.endTime ? "border-red-500" : ""}
              />
              {state?.errors?.endTime && (
                <p id="end-error" className="text-sm text-red-500">
                  {state.errors.endTime[0]}
                </p>
              )}
            </div>
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
