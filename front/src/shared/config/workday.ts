export const STEP_MINUTES = 15

export const WORK_END_HOUR = 20
export const WORK_START_HOUR = 9

export const WORKDAY_END = `${WORK_END_HOUR}:00`

export const START_HOURS = Array.from(
  { length: WORK_END_HOUR - WORK_START_HOUR },
  (_, i) => WORK_START_HOUR + i
)

export const BOOKING_WINDOW_DAYS = 30
