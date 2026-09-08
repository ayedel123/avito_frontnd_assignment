const formatTime = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)

const tzLabel = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(date)
  return parts.find((part) => part.type === "timeZoneName")?.value ?? ""
}

export const formatBookingSummary = (
  roomName: string,
  start: Date,
  end: Date,
  timeZone: string
) => {
  const date = new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    day: "numeric",
    month: "long",
  }).format(start)

  return `Комната ${roomName}, ${date}, ${formatTime(start, timeZone)}–${formatTime(
    end,
    timeZone
  )} ${tzLabel(start, timeZone)}`
}
