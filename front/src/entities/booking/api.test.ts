import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/shared/lib/axiosInstance", () => ({
  axiosInstance: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}))

import { axiosInstance } from "@/shared/lib/axiosInstance"
import { bookRoom, cancelBooking, getBookings } from "./api"

const get = vi.mocked(axiosInstance.get)
const post = vi.mocked(axiosInstance.post)
const del = vi.mocked(axiosInstance.delete)

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
  post.mockReset()
  del.mockReset()
  vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("getBookings", () => {
  it("возвращает массив items и передаёт params", async () => {
    get.mockResolvedValue({ data: { items: [booking] } })
    await expect(
      getBookings({ scope: "all", officeId: "o1" })
    ).resolves.toEqual([booking])
    expect(get).toHaveBeenCalledWith("/bookings", {
      params: { scope: "all", officeId: "o1" },
    })
  })

  it("бросает при битой схеме", async () => {
    get.mockResolvedValue({ data: { items: [{ id: "b1" }] } })
    await expect(getBookings()).rejects.toThrow(/не соответствует схеме/)
  })
})

describe("cancelBooking", () => {
  it("шлёт DELETE /bookings/:id", async () => {
    del.mockResolvedValue({})
    await cancelBooking("b1")
    expect(del).toHaveBeenCalledWith("/bookings/b1")
  })
})

describe("bookRoom", () => {
  it("шлёт POST /bookings и возвращает data", async () => {
    post.mockResolvedValue({ data: booking })
    const params = {
      roomId: "r1",
      title: "T",
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      comment: "",
    }
    await expect(bookRoom(params)).resolves.toEqual(booking)
    expect(post).toHaveBeenCalledWith("/bookings", params)
  })
})
