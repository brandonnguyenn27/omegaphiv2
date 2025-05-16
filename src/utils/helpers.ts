// Format date for display
export const formatDateForDisplay = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date for form submission (YYYY-MM-DD)
export const formatDateForValue = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};
