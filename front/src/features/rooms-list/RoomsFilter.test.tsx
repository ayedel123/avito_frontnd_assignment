import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/entities/rooms-filter/hooks", () => ({
  useStartTimeFilter: () => ({
    time: null,
    setTime: vi.fn(),
    hours: [9, 10],
    max: undefined,
  }),
  useDurationFilter: () => ({
    duration: null,
    setDuration: vi.fn(),
    maxMinutes: 60,
  }),
  useCapacityFilter: () => ({ capacity: null, setCapacity: vi.fn() }),
}))
vi.mock("./RoomsDateFilter/RoomsDateFilter", () => ({
  RoomsDateFilter: () => <div data-testid="date" />,
}))
vi.mock("@/shared/components/ui/TimePicker", () => ({
  TimePicker: () => <div data-testid="time" />,
}))
vi.mock("@/shared/components/ui/DurationPicker", () => ({
  DurationPicker: () => <div data-testid="duration" />,
}))
vi.mock("@/shared/components/ui/CapacityPicker", () => ({
  CapacityPicker: () => <div data-testid="capacity" />,
}))

import { RoomsFilter } from "./RoomsFilter"

describe("RoomsFilter", () => {
  it("рендерит поля фильтров", () => {
    render(<RoomsFilter />)
    expect(screen.getByText("Дата")).toBeInTheDocument()
    expect(screen.getByText("Начало")).toBeInTheDocument()
    expect(screen.getByText("Длительность")).toBeInTheDocument()
    expect(screen.getByText("Вместимость")).toBeInTheDocument()
  })
})
