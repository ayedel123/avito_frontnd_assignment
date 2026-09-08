import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/shared/lib/axiosInstance", () => ({
  axiosInstance: { get: vi.fn() },
}))

import { axiosInstance } from "@/shared/lib/axiosInstance"
import { getRoom, getRooms } from "./api"

const get = vi.mocked(axiosInstance.get)

const office = {
  id: "o1",
  name: "Офис Москва",
  address: "ул. Лесная 7",
  timezone: "Europe/Moscow",
}
const room = {
  id: "r1",
  officeId: "o1",
  name: "Эверест",
  floor: 4,
  capacity: 12,
  features: [],
  office,
}

beforeEach(() => {
  get.mockReset()
  vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("getRooms", () => {
  it("передаёт query-параметры и возвращает { items }", async () => {
    get.mockResolvedValue({ data: { items: [room] } })
    await expect(
      getRooms({ officeId: "o1", minCapacity: 4 })
    ).resolves.toEqual({ items: [room] })
    expect(get).toHaveBeenCalledWith("/rooms", {
      params: { officeId: "o1", minCapacity: 4 },
    })
  })

  it("бросает при битой схеме", async () => {
    get.mockResolvedValue({ data: { items: [{ id: "r1" }] } })
    await expect(getRooms({ officeId: "o1" })).rejects.toThrow(
      /не соответствует схеме/
    )
  })
})

describe("getRoom", () => {
  it("запрашивает /rooms/:id и парсит", async () => {
    get.mockResolvedValue({ data: room })
    await expect(getRoom("r1")).resolves.toEqual(room)
    expect(get).toHaveBeenCalledWith("/rooms/r1")
  })

  it("бросает при битой схеме", async () => {
    get.mockResolvedValue({ data: { id: "r1" } })
    await expect(getRoom("r1")).rejects.toThrow(/не соответствует схеме/)
  })
})
