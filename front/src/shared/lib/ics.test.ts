import { describe, expect, it } from "vitest"
import type { UserBooking } from "@/entities/booking/types"
import { buildBookingIcs, buildBookingsIcs } from "./ics"

const booking: UserBooking = {
  id: "b1",
  roomId: "r1",
  userId: "u1",
  title: "Daily Sync, встреча",
  comment: "Обсудить релиз",
  startsAt: "2026-10-24T07:00:00.000Z",
  endsAt: "2026-10-24T08:00:00.000Z",
  createdAt: "2026-10-20T10:00:00.000Z",
  room: { id: "r1", officeId: "o1", name: "Эверест", floor: 4, capacity: 12, features: [] },
  office: {
    id: "o1",
    name: "Офис Москва",
    address: "ул. Лесная 7",
    timezone: "Europe/Moscow",
  },
  owner: {
    id: "u1",
    login: "kk",
    displayName: "K",
    email: "k@e.com",
    avatarUrl: null,
    initials: "KK",
  },
}

describe("buildBookingIcs", () => {
  it("формирует валидный VCALENDAR/VEVENT", () => {
    const ics = buildBookingIcs(booking)
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true)
    expect(ics).toContain("BEGIN:VEVENT")
    expect(ics).toContain("END:VEVENT")
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true)
    expect(ics).toContain("UID:b1@bookroom")
  })

  it("пишет даты в UTC-формате и разделяет строки CRLF", () => {
    const ics = buildBookingIcs(booking)
    expect(ics).toContain("DTSTART:20261024T070000Z")
    expect(ics).toContain("DTEND:20261024T080000Z")
    expect(ics).toContain("\r\n")
  })

  it("экранирует запятые в тексте и включает описание", () => {
    const ics = buildBookingIcs(booking)
    expect(ics).toContain("SUMMARY:Daily Sync\\, встреча")
    expect(ics).toContain("DESCRIPTION:Обсудить релиз")
    expect(ics).toContain("Комната Эверест\\, Офис Москва\\, ул. Лесная 7")
  })

  it("без комментария не добавляет DESCRIPTION", () => {
    const ics = buildBookingIcs({ ...booking, comment: null })
    expect(ics).not.toContain("DESCRIPTION:")
  })
})

describe("buildBookingsIcs", () => {
  it("кладёт несколько VEVENT в один VCALENDAR", () => {
    const ics = buildBookingsIcs([booking, { ...booking, id: "b2" }])
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2)
    expect(ics).toContain("UID:b1@bookroom")
    expect(ics).toContain("UID:b2@bookroom")
    expect((ics.match(/BEGIN:VCALENDAR/g) ?? []).length).toBe(1)
  })

  it("пустой список → календарь без событий", () => {
    const ics = buildBookingsIcs([])
    expect(ics).toContain("BEGIN:VCALENDAR")
    expect(ics).not.toContain("BEGIN:VEVENT")
  })
})
