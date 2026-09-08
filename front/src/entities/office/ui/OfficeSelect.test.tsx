import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { PropsWithChildren } from "react"

const state = vi.hoisted(() => ({
  offices: { isLoading: false, isError: false, data: undefined as unknown },
  selected: {
    isLoading: false,
    isError: false,
    office: undefined as unknown,
  },
}))

vi.mock("../hooks", () => ({
  useOffices: () => state.offices,
  useSelectedOffice: () => state.selected,
}))

import { OfficeSelect } from "./OfficeSeelct"

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
  state.selected = { isLoading: false, isError: false, office: undefined }
})

describe("OfficeSelect", () => {
  it("loading → скелетон", () => {
    state.offices.isLoading = true
    const { container } = render(<OfficeSelect />, { wrapper })
    expect(
      container.querySelector('[data-slot="skeleton"]')
    ).toBeInTheDocument()
  })

  it("error → плейсхолдер об ошибке", () => {
    state.offices.isError = true
    render(<OfficeSelect />, { wrapper })
    expect(screen.getByText("Офисы не пришли(")).toBeInTheDocument()
  })

  it("success → рендерится без ошибки", () => {
    state.offices.data = { items: [office], byId: { o1: office } }
    render(<OfficeSelect />, { wrapper })
    expect(screen.queryByText("Офисы не пришли(")).not.toBeInTheDocument()
  })
})
