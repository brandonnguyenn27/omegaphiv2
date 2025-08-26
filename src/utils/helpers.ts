// Format date for display preserving original timezone
export const formatDateForDisplay = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date for form submission (YYYY-MM-DD) preserving original timezone
export const formatDateForValue = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Format time for display preserving original timezone
export const formatTimeForDisplay = (timeString: string | Date) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
