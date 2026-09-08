import { beforeEach, describe, expect, it, vi } from "vitest"
import { AxiosError, type AxiosResponse } from "axios"

vi.mock("@/entities/booking/api", () => ({ bookRoom: vi.fn() }))
import { bookRoom } from "@/entities/booking/api"
import { fireSeries, type BookingTemplate } from "./materialize"

const bookMock = vi.mocked(bookRoom)

const template: BookingTemplate = {
  roomId: "r1",
  title: "Daily",
  comment: "",
  time: "10:00",
  durationMinutes: 60,
  timezone: "Europe/Moscow",
}

const conflict = () =>
  new AxiosError("Error", "ERR", undefined, undefined, {
    status: 409,
    statusText: "",
    headers: {},
    config: { headers: {} },
    data: { error: { code: "SLOT_TAKEN", message: "занято" } },
  } as AxiosResponse)

beforeEach(() => {
  bookMock.mockReset()
})

describe("fireSeries", () => {
  it("считает успешные брони", async () => {
    bookMock.mockResolvedValue({})
    const result = await fireSeries(template, [new Date(2026, 9, 5), new Date(2026, 9, 12)])
    expect(result).toEqual({ created: 2, conflict: 0, error: 0 })
    expect(bookMock).toHaveBeenCalledTimes(2)
  })

  it("409 попадает в conflict, прочее — в error, серия не падает", async () => {
    bookMock
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(conflict())
      .mockRejectedValueOnce(new Error("network"))
    const result = await fireSeries(template, [
      new Date(2026, 9, 5),
      new Date(2026, 9, 12),
      new Date(2026, 9, 19),
    ])
    expect(result).toEqual({ created: 1, conflict: 1, error: 1 })
  })
})
