import type { RecurringMode } from "./types"

export interface Anchor {
  mode: RecurringMode
  weekday: number // 0..6
  dayOfMonth: number // 1..31
}

const MAX_STEPS = 60

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const fromDateKey = (key: string): Date => {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const nextOccurrence = (anchor: Anchor, from: Date): Date => {
  if (anchor.mode === "weekly") {
    let date = addDays(from, 1)
    while (date.getDay() !== anchor.weekday) date = addDays(date, 1)
    return date
  }

  let year = from.getFullYear()
  let month = from.getMonth()
  for (let step = 0; step < MAX_STEPS; step += 1) {
    const candidate = new Date(year, month, anchor.dayOfMonth)
    if (
      candidate.getDate() === anchor.dayOfMonth &&
      candidate.getTime() > from.getTime()
    ) {
      return candidate
    }
    month += 1
    if (month > 11) {
      month = 0
      year += 1
    }
  }

  return addDays(from, 1)
}

export const collectUntil = (
  anchor: Anchor,
  from: Date,
  until: Date
): { dates: Date[]; next: Date } => {
  const dates: Date[] = []
  let date = from
  let steps = 0
  while (date.getTime() <= until.getTime() && steps < MAX_STEPS) {
    dates.push(date)
    date = nextOccurrence(anchor, date)
    steps += 1
  }
  return { dates, next: date }
}
