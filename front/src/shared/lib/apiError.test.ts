import { describe, expect, it } from "vitest"
import { AxiosError, type AxiosResponse } from "axios"
import { getApiError } from "./apiError"

describe("getApiError", () => {
  it("axios с ответом: достаёт status, code и message из тела", () => {
    const error = new AxiosError("network", "ERR", undefined, undefined, {
      status: 409,
      statusText: "",
      headers: {},
      config: { headers: {} },
      data: { error: { code: "BOOKING_CONFLICT", message: "занято" } },
    } as AxiosResponse)

    expect(getApiError(error)).toEqual({
      status: 409,
      code: "BOOKING_CONFLICT",
      message: "занято",
    })
  })

  it("axios без ответа: fallback на error.message", () => {
    const error = new AxiosError("timeout", "ECONNABORTED")
    expect(getApiError(error)).toEqual({
      status: undefined,
      code: undefined,
      message: "timeout",
    })
  })

  it("обычный Error: только message", () => {
    expect(getApiError(new Error("boom"))).toEqual({ message: "boom" })
  })

  it("не-Error: 'Неизвестная ошибка'", () => {
    expect(getApiError("что-то")).toEqual({ message: "Неизвестная ошибка" })
  })
})
