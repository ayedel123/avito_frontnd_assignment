import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { BookingCardSkeleton } from "./BookingCardSkeleton"

describe("BookingCardSkeleton", () => {
  it("рендерит скелетоны и совпадает со снапшотом", () => {
    const { container } = render(<BookingCardSkeleton />)
    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length
    ).toBeGreaterThan(0)
    expect(container).toMatchSnapshot()
  })
})
