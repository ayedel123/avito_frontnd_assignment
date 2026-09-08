import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/shared/lib/axiosInstance", () => ({
  axiosInstance: { get: vi.fn() },
}))

import { axiosInstance } from "@/shared/lib/axiosInstance"
import { getRoomSchedule } from "./scheduleApi"

const get = vi.mocked(axiosInstance.get)

const office = {
  id: "o1",
  name: "Офис Москва",
  address: "ул. Лесная 7",
  timezone: "Europe/Moscow",
}
const booking = {
  id: "b1",
  roomId: "r1",
  userId: "u1",
  title: "Daily Sync",
  comment: null,
  startsAt: "2026-10-24T07:00:00.000Z",
  endsAt: "2026-10-24T08:00:00.000Z",
  createdAt: "2026-10-20T10:00:00.000Z",
  room: { id: "r1", officeId: "o1", name: "Эверест", floor: 4, capacity: 12, features: [] },
  office,
  owner: {
    id: "u1",
    login: "kk",
    displayName: "K",
    email: "k@e.com",
    avatarUrl: null,
    initials: "KK",
  },
}

beforeEach(() => {
  get.mockReset()
  vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("getRoomSchedule", () => {
  it("запрашивает /rooms/:id/bookings и возвращает items", async () => {
    get.mockResolvedValue({ data: { items: [booking] } })
    const params = { from: "2026-10-23T21:00:00.000Z", to: "2026-10-24T21:00:00.000Z" }
    await expect(getRoomSchedule("r1", params)).resolves.toEqual([booking])
    expect(get).toHaveBeenCalledWith("/rooms/r1/bookings", { params })
  })

  it("бросает при битой схеме", async () => {
    get.mockResolvedValue({ data: { items: [{ id: "b1" }] } })
    await expect(
      getRoomSchedule("r1", { from: "a", to: "b" })
    ).rejects.toThrow(/не соответствует схеме/)
  })
})
