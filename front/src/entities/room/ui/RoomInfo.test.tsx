import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import type { RoomItem } from "../types"
import { RoomInfo } from "./RoomInfo"

const room: RoomItem = {
  id: "r1",
  officeId: "o1",
  name: "Эверест",
  floor: 4,
  capacity: 12,
  features: [
    { code: "projector", name: "Проектор" },
    { code: "video", name: "Видеосвязь" },
  ],
  office: {
    id: "o1",
    name: "Офис Москва",
    address: "ул. Лесная 7",
    timezone: "Europe/Moscow",
  },
}

describe("RoomInfo", () => {
  it("рендерит название, офис, вместимость и фичи", () => {
    const { container } = render(<RoomInfo room={room} />)
    expect(screen.getByText("Эверест")).toBeInTheDocument()
    expect(screen.getByText("Офис Москва · ул. Лесная 7")).toBeInTheDocument()
    expect(screen.getByText(/Вместимость: до 12 человек/)).toBeInTheDocument()
    expect(screen.getByText("Проектор")).toBeInTheDocument()
    expect(screen.getByText("Видеосвязь")).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
