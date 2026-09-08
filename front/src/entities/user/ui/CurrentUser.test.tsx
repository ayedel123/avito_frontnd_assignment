import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("../hooks", () => ({ useUser: vi.fn() }))
import { useUser } from "../hooks"
import { CurrentUser } from "./CurrentUser"

const useUserMock = vi.mocked(useUser)


const mockState = (state: Partial<ReturnType<typeof useUser>>) =>
  useUserMock.mockReturnValue(state as ReturnType<typeof useUser>)

beforeEach(() => useUserMock.mockReset())

describe("CurrentUser", () => {
  it("loading: показывает скелетон", () => {
    mockState({ isLoading: true, isError: false, data: undefined })
    const { container } = render(<CurrentUser />)
    expect(
      container.querySelector('[data-slot="skeleton"]')
    ).toBeInTheDocument()
  })

  it("ошибка/нет пользователя: 'Пользователь не найден'", () => {
    mockState({ isLoading: false, isError: true, data: undefined })
    render(<CurrentUser />)
    expect(screen.getByText("Пользователь не найден")).toBeInTheDocument()
  })

})
