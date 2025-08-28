import { format } from "date-fns";

// Format date for display preserving original timezone
export const formatDateForDisplay = (dateString: string | Date) => {
  const date = new Date(dateString);
  // Use UTC methods to avoid timezone conversion issues
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Force UTC to prevent timezone conversion
  });
};

// Format date for form submission (YYYY-MM-DD) preserving original timezone
export const formatDateForValue = (dateString: string | Date) => {
  const date = new Date(dateString);
  // Use UTC methods to avoid timezone conversion issues
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format time for display preserving original timezone
export const formatTimeForDisplay = (timeString: string | Date) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // Force UTC to prevent timezone conversion
  });
};

// Format functions that handle timezone conversion properly
export const formatDateUTC = (dateValue: Date) => {
  // Use the original date but format it consistently
  return format(dateValue, "MMM d");
};

export const formatTimeUTC = (dateValue: Date) => {
  // Since we're storing time-only values, just format directly
  return format(dateValue, "h:mm a");
};
