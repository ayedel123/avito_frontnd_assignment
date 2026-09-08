export type RecurringMode = "weekly" | "monthly"

export type RepeatMode = "none" | RecurringMode

export interface RecurringRule {
  id: string
  roomId: string
  roomName: string
  timezone: string
  title: string
  comment: string
  time: string
  durationMinutes: number
  mode: RecurringMode
  weekday: number
  dayOfMonth: number
  nextDate: string
}
