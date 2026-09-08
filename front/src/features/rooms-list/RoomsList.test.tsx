import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

const s = vi.hoisted(() => ({
  officeId: null as string | null,
  rooms: {
    data: { items: [] as { id: string }[] },
    isLoading: false,
    isRefetching: false,
    isError: false,
    refetch: () => {},
    partialInterval: false,
  },
}))

vi.mock("@/entities/office/hooks", () => ({
  useSelectedOffice: () => ({ officeId: s.officeId }),
}))
vi.mock("@/entities/room/hooks", () => ({ useRooms: () => s.rooms }))
vi.mock("@/entities/rooms-filter/hooks", () => ({
  useRoomsFilters: () => ({ dropFilters: vi.fn() }),
}))
vi.mock("./RoomCard/RoomCard", () => ({
  RoomCard: ({ room }: { room: { id: string } }) => (
    <div data-testid="card">{room.id}</div>
  ),
}))
vi.mock("./RoomCard/RoomCardSkeleton", () => ({
  RoomCardSkeleton: () => <div data-testid="skeleton" />,
}))
vi.mock("@/features/book-room/ui/BookRoomDialog", () => ({
  BookRoomDialog: () => null,
}))

import { RoomsList } from "./RoomsList"

beforeEach(() => {
  s.officeId = "o1"
  s.rooms = {
    data: { items: [] },
    isLoading: false,
    isRefetching: false,
    isError: false,
    refetch: () => {},
    partialInterval: false,
  }
})

describe("RoomsList", () => {
  it("нет офиса → 'Выберите офис'", () => {
    s.officeId = null
    render(<RoomsList />)
    expect(screen.getByText("Выберите офис")).toBeInTheDocument()
  })

  it("частичный интервал → 'Укажите интервал полностью'", () => {
    s.rooms.partialInterval = true
    render(<RoomsList />)
    expect(screen.getByText("Укажите интервал полностью")).toBeInTheDocument()
  })

  it("загрузка → скелетоны", () => {
    s.rooms.isLoading = true
    render(<RoomsList />)
    expect(screen.getAllByTestId("skeleton")).toHaveLength(6)
  })

  it("ошибка → сообщение об ошибке", () => {
    s.rooms.isError = true
    render(<RoomsList />)
    expect(screen.getByText("Не удалось загрузить данные")).toBeInTheDocument()
  })

  it("пусто → 'Нет доступных переговорных'", () => {
    render(<RoomsList />)
    expect(screen.getByText("Нет доступных переговорных")).toBeInTheDocument()
  })

  it("данные → карточки", () => {
    s.rooms.data = { items: [{ id: "1" }, { id: "2" }] }
    render(<RoomsList />)
    expect(screen.getAllByTestId("card")).toHaveLength(2)
  })
})
