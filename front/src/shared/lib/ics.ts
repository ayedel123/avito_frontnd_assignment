import type { UserBooking } from "@/entities/booking/types"

const toIcsDate = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

const escapeText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")

const buildEvent = (booking: UserBooking): string[] => {
  const location = `Комната ${booking.room.name}, ${booking.office.name}, ${booking.office.address}`

  return [
    "BEGIN:VEVENT",
    `UID:${booking.id}@bookroom`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(booking.startsAt)}`,
    `DTEND:${toIcsDate(booking.endsAt)}`,
    `SUMMARY:${escapeText(booking.title)}`,
    `LOCATION:${escapeText(location)}`,
    ...(booking.comment ? [`DESCRIPTION:${escapeText(booking.comment)}`] : []),
    "END:VEVENT",
  ]
}

const wrapCalendar = (events: string[][]): string =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BookRoom//RU",
    ...events.flat(),
    "END:VCALENDAR",
  ].join("\r\n")

export const buildBookingIcs = (booking: UserBooking): string =>
  wrapCalendar([buildEvent(booking)])

export const buildBookingsIcs = (bookings: UserBooking[]): string =>
  wrapCalendar(bookings.map(buildEvent))

export const downloadIcs = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
