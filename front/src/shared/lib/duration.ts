export interface Duration {
  hours: number
  minutes: number
}

export const durationToMinutes = (duration: Duration): number =>
  duration.hours * 60 + duration.minutes

export const minutesToDuration = (minutes: number): Duration => ({
  hours: Math.floor(minutes / 60),
  minutes: minutes % 60,
})

export const timeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number)
  return hour * 60 + minute
}

export const formatDuration = (duration: Duration): string => {
  const parts: string[] = []
  if (duration.hours) parts.push(`${duration.hours} ч`)
  if (duration.minutes) parts.push(`${duration.minutes} мин`)
  return parts.join(" ") || "0 мин"
}
