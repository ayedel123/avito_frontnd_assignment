import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children?: ReactNode }) => <a>{children}</a>,
}))

import { BookingsEmpty } from "./BookingsEmpty"

describe("BookingsEmpty", () => {
  it("рендерит заголовок, описание и кнопку", () => {
    render(<BookingsEmpty description="Пусто тут" />)
    expect(screen.getByText("Нет бронирований")).toBeInTheDocument()
    expect(screen.getByText("Пусто тут")).toBeInTheDocument()
    expect(
      screen.getByText("Перейти к переговорным")
    ).toBeInTheDocument()
  })
})
