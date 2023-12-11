export const getTimestampInTimezone = (dateString, timezone) => {
  // Parse the input date string
  const inputDate = new Date(dateString);

  // Convert the date to the specified timezone
  const options = { timeZone: timezone };
  const timestampInTimezone = inputDate.toLocaleString('en-US', options);

  // Return the millisecond timestamp of the converted date
  return Date.parse(timestampInTimezone);
}