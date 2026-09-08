import { getTodayInTimeZone } from "./getTodayInTimeZone"

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const getDateBounds = (timeZone: string | undefined, daysAhead: number) => {
  const zone = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const minDate = getTodayInTimeZone(zone)
  const maxDate = addDays(minDate, daysAhead)
  return { minDate, maxDate }
}
