import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { BookingsError } from "./BookingsError"

describe("BookingsError", () => {
  it("рендерит текст ошибки и вызывает onRetry", () => {
    const onRetry = vi.fn()
    render(<BookingsError onRetry={onRetry} />)

    expect(screen.getByText("Не удалось загрузить данные")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Попробовать снова" }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
