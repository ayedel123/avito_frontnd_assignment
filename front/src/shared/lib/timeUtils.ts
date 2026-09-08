export const getTimeZoneOffsetMs = (timeZone: string, date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date)

  const map: Record<string, number> = {}
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = Number(part.value)
  }

  const asUtc = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    map.hour,
    map.minute,
    map.second
  )

  return asUtc - date.getTime()
}

export const toIsoWithOffset = (
  date: Date | null,
  time: string | null,
  timeZone: string
) => {
  if (!date || !time) return undefined

  const [hour, minute] = time.split(":").map(Number)
  const utcGuess = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute
  )
  const offset = getTimeZoneOffsetMs(timeZone, new Date(utcGuess))

  return new Date(utcGuess - offset).toISOString()
}
