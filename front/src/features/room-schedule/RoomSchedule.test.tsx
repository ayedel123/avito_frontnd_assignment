import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

const bookings = [
  {
    id: "b1",
    userId: "u1",
    title: "Мой созвон",
    startsAt: "2026-10-24T07:00:00.000Z",
    endsAt: "2026-10-24T08:00:00.000Z",
  },
  {
    id: "b2",
    userId: "other",
    title: "Чужая встреча",
    startsAt: "2026-10-24T09:00:00.000Z",
    endsAt: "2026-10-24T10:00:00.000Z",
  },
]

vi.mock("@/entities/rooms-filter/hooks", () => ({
  useDatePicker: () => ({ date: null, setDate: vi.fn() }),
}))
vi.mock("@/entities/room/useRoomSchedule", () => ({
  useRoomSchedule: () => ({ data: bookings }),
}))
vi.mock("@/entities/user/hooks", () => ({ useUser: () => ({ data: { id: "u1" } }) }))
vi.mock("@/shared/components/ui/DatePicker", () => ({
  DatePicker: () => <div data-testid="date" />,
}))
vi.mock("@/features/book-room/ui/BookRoomDialog", () => ({
  BookRoomDialog: () => null,
}))

import { RoomSchedule } from "./RoomSchedule"
import type { RoomItem } from "@/entities/room/types"

const room: RoomItem = {
  id: "r1",
  officeId: "o1",
  name: "Эверест",
  floor: 4,
  capacity: 12,
  features: [],
  office: {
    id: "o1",
    name: "Офис Москва",
    address: "ул. Лесная 7",
    timezone: "Europe/Moscow",
  },
}

describe("RoomSchedule", () => {
  it("свою бронь показывает названием, чужую — 'Занято'", () => {
    render(<RoomSchedule room={room} />)
    expect(screen.getByText("Расписание на день")).toBeInTheDocument()
    expect(screen.getByText("Мой созвон")).toBeInTheDocument()
    expect(screen.getByText("Занято")).toBeInTheDocument()
    expect(screen.queryByText("Чужая встреча")).not.toBeInTheDocument()
  })
})
