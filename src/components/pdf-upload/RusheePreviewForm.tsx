"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Calendar,
  Save,
  XCircle,
  Loader2,
  Edit3,
  Trash2,
} from "lucide-react";
import { saveEditedRushee } from "@/app/(authenticated)/(admin)/admin/actions";
import {
  ApiResponse,
  CreateRusheeResponse,
  PythonApiResponse,
} from "@/lib/types";

// Helper function to format time for HTML time input (HH:MM format)
function formatTimeForInput(timeString: string): string {
  if (!timeString) return "";

  try {
    // Handle different time formats that might come from the Python API
    // If it's already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // If it's in HH:MM:SS format, remove seconds
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
      return timeString.substring(0, 5);
    }

    // If it's a full ISO string or timestamp, parse it
    const date = new Date(timeString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid time string:", timeString);
      return "";
    }

    // Format as HH:MM
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.warn("Error formatting time:", timeString, error);
    return "";
  }
}

// Helper function to format date for HTML date input (YYYY-MM-DD format)
function formatDateForInput(dateString: string): string {
  if (!dateString) return "";

  try {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Parse the date and format it
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "";
    }

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return "";
  }
}

// Helper function to convert time input back to format expected by server
function formatTimeForServer(timeInput: string, dateString: string): string {
  if (!timeInput || !dateString) return "";

  try {
    // Combine date and time to create a proper ISO string
    const dateTimeString = `${dateString}T${timeInput}:00.000Z`;
    return dateTimeString;
  } catch (error) {
    console.warn("Error formatting time for server:", timeInput, error);
    return "";
  }
}

interface RusheePreviewFormProps {
  parsedData: PythonApiResponse;
  onCancel: () => void;
  onSuccess: (result: ApiResponse<CreateRusheeResponse>) => void;
}

export function RusheePreviewForm({
  parsedData,
  onCancel,
  onSuccess,
}: RusheePreviewFormProps) {
  // Debug: Log the raw parsed data to understand the format
  console.log("Raw parsed data in RusheePreviewForm:", parsedData);
  console.log("Sample availability:", parsedData.availabilities[0]);

  const [rusheeData, setRusheeData] = useState({
    name: parsedData.rushee.name,
    email: parsedData.rushee.email,
    phoneNumber: parsedData.rushee.phoneNumber || "",
    major: parsedData.rushee.major || "",
  });

  const [availabilities, setAvailabilities] = useState(
    parsedData.availabilities.map((avail) => {
      const formattedDate = formatDateForInput(avail.date);
      const formattedStartTime = formatTimeForInput(avail.startTime);
      const formattedEndTime = formatTimeForInput(avail.endTime);

      console.log(`Converting date: "${avail.date}" -> "${formattedDate}"`);
      console.log(
        `Converting time: "${avail.startTime}" -> "${formattedStartTime}"`
      );
      console.log(
        `Converting time: "${avail.endTime}" -> "${formattedEndTime}"`
      );

      return {
        date: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };
    })
  );
  const [isPending, startTransition] = useTransition();

  const handleRusheeDataChange = (field: string, value: string) => {
    setRusheeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvailabilityChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setAvailabilities((prev) =>
      prev.map((avail, i) =>
        i === index ? { ...avail, [field]: value } : avail
      )
    );
  };

  const removeAvailability = (index: number) => {
    setAvailabilities((prev) => prev.filter((_, i) => i !== index));
  };

  const addAvailability = () => {
    setAvailabilities((prev) => [
      ...prev,
      {
        date: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Filter out empty availabilities and convert time format
    const validAvailabilities = availabilities
      .filter((avail) => avail.date && avail.startTime && avail.endTime)
      .map((avail) => ({
        date: avail.date,
        startTime: formatTimeForServer(avail.startTime, avail.date),
        endTime: formatTimeForServer(avail.endTime, avail.date),
      }));

    if (validAvailabilities.length === 0) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", rusheeData.name);
      formData.append("email", rusheeData.email);
      formData.append("phoneNumber", rusheeData.phoneNumber);
      formData.append("major", rusheeData.major);
      formData.append("availabilities", JSON.stringify(validAvailabilities));

      const result = await saveEditedRushee(null, formData);
      onSuccess(result);
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Review and Edit Rushee Data
        </CardTitle>
        <CardDescription>
          Please review the parsed data below and make any necessary changes
          before creating the rushee record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rushee Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Rushee Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={rusheeData.name}
                  onChange={(e) =>
                    handleRusheeDataChange("name", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={rusheeData.email}
                  onChange={(e) =>
                    handleRusheeDataChange("email", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={rusheeData.phoneNumber}
                  onChange={(e) =>
                    handleRusheeDataChange("phoneNumber", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  value={rusheeData.major}
                  onChange={(e) =>
                    handleRusheeDataChange("major", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Availabilities */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Availabilities ({availabilities.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAvailability}
              >
                Add Availability
              </Button>
            </div>

            <div className="space-y-4">
              {availabilities.map((availability, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`date-${index}`}>Date</Label>
                      <Input
                        id={`date-${index}`}
                        type="date"
                        value={availability.date}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            index,
                            "date",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`startTime-${index}`}>Start Time</Label>
                      <Input
                        id={`startTime-${index}`}
                        type="time"
                        value={availability.startTime}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            index,
                            "startTime",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`endTime-${index}`}>End Time</Label>
                      <Input
                        id={`endTime-${index}`}
                        type="time"
                        value={availability.endTime}
                        onChange={(e) =>
                          handleAvailabilityChange(
                            index,
                            "endTime",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAvailability(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {availabilities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No availabilities added yet.</p>
                <p className="text-sm">
                  Click &quot;Add Availability&quot; to add time slots.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isPending ||
                !rusheeData.name ||
                !rusheeData.email ||
                availabilities.length === 0
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Rushee...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Rushee
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
