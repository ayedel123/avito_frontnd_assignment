import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"

const state = vi.hoisted(() => ({
  offices: {
    isLoading: false,
    isError: false,
    data: undefined as unknown,
  },
}))

vi.mock("@/entities/office/hooks", () => ({
  useOffices: () => state.offices,
}))

import { OfficeFilter } from "./OfficeFilter"

const office = {
  id: "o1",
  name: "Офис Москва",
  address: "ул. Лесная 7",
  timezone: "Europe/Moscow",
}

const wrapper = ({ children }: PropsWithChildren) => (
  <NuqsTestingAdapter searchParams="">{children}</NuqsTestingAdapter>
)

beforeEach(() => {
  state.offices = { isLoading: false, isError: false, data: undefined }
})

describe("OfficeFilter", () => {
  it("loading → скелетон", () => {
    state.offices.isLoading = true
    const { container } = render(<OfficeFilter />, { wrapper })
    expect(
      container.querySelector('[data-slot="skeleton"]')
    ).toBeInTheDocument()
  })

  it("error → плейсхолдер об ошибке", () => {
    state.offices.isError = true
    render(<OfficeFilter />, { wrapper })
    expect(screen.getByText("Офисы не пришли(")).toBeInTheDocument()
  })

  it("success → без ошибки и скелетона", () => {
    state.offices.data = { items: [office], byId: { o1: office } }
    const { container } = render(<OfficeFilter />, { wrapper })
    expect(screen.queryByText("Офисы не пришли(")).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="skeleton"]')
    ).not.toBeInTheDocument()
  })
})
