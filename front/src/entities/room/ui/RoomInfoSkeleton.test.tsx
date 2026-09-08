import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { RoomInfoSkeleton } from "./RoomInfoSkeleton"

describe("RoomInfoSkeleton", () => {
  it("рендерит скелетоны и совпадает со снапшотом", () => {
    const { container } = render(<RoomInfoSkeleton />)
    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length
    ).toBeGreaterThan(0)
    expect(container).toMatchSnapshot()
  })
})
