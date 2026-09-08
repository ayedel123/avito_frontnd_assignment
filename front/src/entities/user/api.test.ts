import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/shared/lib/axiosInstance", () => ({
  axiosInstance: { get: vi.fn() },
}))

import { axiosInstance } from "@/shared/lib/axiosInstance"
import { whoami } from "./api"

const get = vi.mocked(axiosInstance.get)

const user = {
  id: "u1",
  login: "kk",
  displayName: "Константин К.",
  email: "kk@example.com",
  avatarUrl: null,
  initials: "КК",
}

beforeEach(() => {
  get.mockReset()
  vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("whoami", () => {
  it("запрашивает /me и возвращает пользователя", async () => {
    get.mockResolvedValue({ data: user })
    await expect(whoami()).resolves.toEqual(user)
    expect(get).toHaveBeenCalledWith("/me")
  })

  it("бросает при несоответствии схеме", async () => {
    get.mockResolvedValue({ data: { id: 1 } })
    await expect(whoami()).rejects.toThrow(/не соответствует схеме User/)
  })
})
