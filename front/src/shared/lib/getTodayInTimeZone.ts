export const getTodayInTimeZone = (timeZone: string): Date => {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("-")
    .map(Number)
  return new Date(year, month - 1, day)
}
