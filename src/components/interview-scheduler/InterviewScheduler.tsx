"use client";
import React from "react";
import { format, addMinutes, parseISO } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  InterviewDate,
  RusheeAvailabilityExtended,
  UserAvailabilityExtended,
  InterviewAssignmentExtended,
  Rushee,
} from "@/lib/types";
import TimeSlotCell from "@/components/interview-scheduler/TimeSlotCell";

function generateTimeSlots(startHour: number, endHour: number) {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
}

function formatTimeSlotWithDateFns(timeSlot: string) {
  const [hour, minute] = timeSlot.split(":");
  const tempDate = new Date(2025, 0, 1, +hour, +minute);
  return format(tempDate, "h:mm a");
}

function padTime(timeSlot: string) {
  const [hour, minute] = timeSlot.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

interface InterviewSchedulerProps {
  interviewDates: InterviewDate[];
  rushees: Rushee[];
  rusheeAvailabilities: RusheeAvailabilityExtended[];
  userAvailabilities: UserAvailabilityExtended[];
  interviewAssignments: InterviewAssignmentExtended[];
}

export default function InterviewScheduler({
  interviewDates,
  rushees,
  rusheeAvailabilities,
  userAvailabilities,
  interviewAssignments,
}: InterviewSchedulerProps) {
  const distinctDates = interviewDates
    .map((day) => {
      // Use UTC components to avoid timezone shift
      const year = day.date.getUTCFullYear();
      const month = String(day.date.getUTCMonth() + 1).padStart(2, "0");
      const date = String(day.date.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${date}`;
    })
    .sort();

  const timeSlots = generateTimeSlots(9, 21); // 9 AM to 9 PM

  if (distinctDates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No interview dates found. Please create interview dates first.
      </div>
    );
  }

  if (rushees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No rushees found. Please add rushees first.
      </div>
    );
  }

  return (
    <div className="p-4">
      <Tabs defaultValue={distinctDates[0]}>
        <TabsList className="mb-4 space-x-2">
          {distinctDates.map((date) => {
            return (
              <TabsTrigger
                key={date}
                value={date}
                className="rounded-md shadow-sm hover:bg-gray-200"
              >
                {format(parseISO(date), "MMM dd, yyyy")}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {distinctDates.map((date) => {
          const availabilitiesForDay = (rusheeAvailabilities || []).filter(
            (a) => {
              if (!a.date) return false;
              const year = a.date.getUTCFullYear();
              const month = String(a.date.getUTCMonth() + 1).padStart(2, "0");
              const dateStr = String(a.date.getUTCDate()).padStart(2, "0");
              return `${year}-${month}-${dateStr}` === date;
            }
          );

          const userAvailabilitiesForDay = (userAvailabilities || []).filter(
            (ua) => {
              if (!ua.date) return false;
              const year = ua.date.getUTCFullYear();
              const month = String(ua.date.getUTCMonth() + 1).padStart(2, "0");
              const dateStr = String(ua.date.getUTCDate()).padStart(2, "0");
              return `${year}-${month}-${dateStr}` === date;
            }
          );

          const assignmentsForDay = (interviewAssignments || []).filter(
            (assignment) => {
              const interviewDate = interviewDates.find(
                (id) => id.id === assignment.interviewDateId
              );
              if (!interviewDate) return false;
              const year = interviewDate.date.getUTCFullYear();
              const month = String(
                interviewDate.date.getUTCMonth() + 1
              ).padStart(2, "0");
              const dateStr = String(interviewDate.date.getUTCDate()).padStart(
                2,
                "0"
              );
              return `${year}-${month}-${dateStr}` === date;
            }
          );

          return (
            <TabsContent
              key={date}
              value={date}
              className="rounded-md border border-gray-300 p-2 shadow-md"
            >
              <div className="overflow-auto">
                <div
                  className="grid auto-cols-fr"
                  style={{
                    gridTemplateColumns: `220px repeat(${timeSlots.length}, minmax(70px, 1fr))`,
                  }}
                >
                  {/* Header row */}
                  <div
                    className="sticky top-0 left-0 bg-gray-100 border-b border-r border-gray-300 z-30"
                    style={{
                      height: "40px",
                    }}
                  ></div>
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className="sticky top-0 bg-gray-100 border-b border-gray-300 text-center text-xs p-2 z-10"
                    >
                      {formatTimeSlotWithDateFns(slot)}
                    </div>
                  ))}

                  {/* Rushee rows */}
                  {rushees.map((rushee: Rushee) => (
                    <React.Fragment key={rushee.id}>
                      <div
                        className={`sticky left-0 bg-white border-r border-b border-gray-300 p-2 text-sm font-medium z-20`}
                      >
                        {rushee.name}
                      </div>
                      {timeSlots.map((slot) => {
                        const paddedSlot = padTime(slot);
                        const slotStart = new Date(`${date}T${paddedSlot}:00Z`);
                        const slotEnd = addMinutes(slotStart, 30);

                        // Check if there's an existing interview assignment for this slot
                        const interviewForSlot = assignmentsForDay.find(
                          (assignment) => {
                            return (
                              assignment.rusheeId === rushee.id &&
                              Math.abs(
                                assignment.startTime.getTime() -
                                  slotStart.getTime()
                              ) < 1000
                            );
                          }
                        );

                        const scheduled = Boolean(interviewForSlot);

                        // Check rushee availability for this slot
                        const rusheeAvailabilities =
                          availabilitiesForDay.filter((a) => {
                            if (a.rusheeId !== rushee.id) return false;
                            if (!a.startTime || !a.endTime) return false;
                            const availStart = new Date(a.startTime);
                            const availEnd = new Date(a.endTime);

                            return (
                              availStart.getTime() <= slotStart.getTime() &&
                              availEnd.getTime() >= slotEnd.getTime()
                            );
                          });
                        const isAvailable = rusheeAvailabilities.length > 0;

                        // Get user availabilities for this slot
                        const userAvailabilitiesForSlot =
                          userAvailabilitiesForDay.filter((ua) => {
                            if (!ua.startTime || !ua.endTime) return false;
                            const userStart = new Date(ua.startTime);
                            const userEnd = new Date(ua.endTime);

                            return userStart < slotEnd && userEnd > slotStart;
                          });

                        return (
                          <TimeSlotCell
                            key={`${rushee.id}-${slot}`}
                            isAvailable={isAvailable}
                            rusheeAvailabilities={rusheeAvailabilities}
                            userAvailabilities={userAvailabilitiesForSlot}
                            scheduled={scheduled}
                            slot={slotStart}
                            interviewDate={interviewDates.find((id) => {
                              const year = id.date.getUTCFullYear();
                              const month = String(
                                id.date.getUTCMonth() + 1
                              ).padStart(2, "0");
                              const dateStr = String(
                                id.date.getUTCDate()
                              ).padStart(2, "0");
                              return `${year}-${month}-${dateStr}` === date;
                            })}
                            rusheeId={rushee.id}
                            existingAssignment={interviewForSlot}
                          />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
