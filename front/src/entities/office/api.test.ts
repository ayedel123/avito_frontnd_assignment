import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/shared/lib/axiosInstance", () => ({
  axiosInstance: { get: vi.fn() },
}))

import { axiosInstance } from "@/shared/lib/axiosInstance"
import { getOffices } from "./api"

const get = vi.mocked(axiosInstance.get)

const office = {
  id: "o1",
  name: "Офис Москва",
  address: "ул. Лесная 7",
  timezone: "Europe/Moscow",
}

beforeEach(() => {
  get.mockReset()
  vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("getOffices", () => {
  it("запрашивает /offices и возвращает распарсенные данные", async () => {
    get.mockResolvedValue({ data: { items: [office] } })
    await expect(getOffices()).resolves.toEqual({ items: [office] })
    expect(get).toHaveBeenCalledWith("/offices")
  })

  it("бросает ошибку при несоответствии схеме", async () => {
    get.mockResolvedValue({ data: { items: "нет" } })
    await expect(getOffices()).rejects.toThrow(/не соответствует схеме/)
  })
})
