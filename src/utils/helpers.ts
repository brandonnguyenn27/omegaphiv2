// Format date for display from UTC database values
export const formatDateForDisplay = (dateString: string | Date) => {
  const date = new Date(dateString);
  // Since dates are stored in UTC, format them in UTC
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Force UTC to prevent timezone conversion
  });
};

// Format date for form submission (YYYY-MM-DD) from UTC database values
export const formatDateForValue = (dateString: string | Date) => {
  const date = new Date(dateString);
  // Since dates are stored in UTC, use UTC methods
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format time for display from UTC database values
export const formatTimeForDisplay = (timeString: string | Date) => {
  const date = new Date(timeString);
  // Since times are stored in UTC, format them in UTC
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // Force UTC to prevent timezone conversion
  });
};

// Format date for EventCard (shorter format)
export const formatDateUTC = (dateValue: Date) => {
  // Since dates are stored in UTC, format them in UTC
  return dateValue.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

// Format time for EventCard and AvailabilityCard from UTC database values
export const formatTimeUTC = (dateValue: Date) => {
  // Since times are stored in UTC, format them in UTC
  return dateValue.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // Force UTC to prevent timezone conversion
  });
};
