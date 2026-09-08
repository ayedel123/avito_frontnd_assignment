import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import type { ComponentProps } from "react"
import type { RoomItem } from "@/entities/room/types"
import { RoomCard } from "./RoomCard"

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
  }: ComponentProps<"a"> & { to?: string; params?: unknown }) => (
    <a>{children}</a>
  ),
}))

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

describe("RoomCard", () => {
  it("рендерит название, этаж и вместимость", () => {
    render(<RoomCard room={room} onClick={() => {}} />)
    expect(screen.getByText("Эверест")).toBeInTheDocument()
    expect(screen.getByText("4 этаж")).toBeInTheDocument()
    expect(
      screen.getByText(/Вместимость: до 12 человек/)
    ).toBeInTheDocument()
  })

  it("available=true: 'Свободна', активная кнопка брони", () => {
    render(<RoomCard room={{ ...room, available: true }} onClick={() => {}} />)
    expect(screen.getByText("Свободна")).toBeInTheDocument()
    expect(screen.getByText("Доступно на выбранное время")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Забронировать" })
    ).toBeEnabled()
  })

  it("available=false: 'Занята', кнопка брони заблокирована", () => {
    render(<RoomCard room={{ ...room, available: false }} onClick={() => {}} />)
    expect(screen.getByText("Занята")).toBeInTheDocument()
    expect(
      screen.getByText("Недоступно на выбранное время")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Забронировать" })
    ).toBeDisabled()
  })

  it("available=undefined: без статуса и плашки, кнопка активна", () => {
    render(<RoomCard room={room} onClick={() => {}} />)
    expect(screen.queryByText("Свободна")).not.toBeInTheDocument()
    expect(screen.queryByText("Занята")).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Забронировать" })
    ).toBeEnabled()
  })

  it("клик по 'Забронировать' вызывает onClick", () => {
    const onClick = vi.fn()
    render(<RoomCard room={{ ...room, available: true }} onClick={onClick} />)
    fireEvent.click(screen.getByRole("button", { name: "Забронировать" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
