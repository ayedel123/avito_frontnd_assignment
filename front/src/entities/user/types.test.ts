import { describe, expect, it } from "vitest"
import { userSchema } from "./types"

const user = {
  id: "u1",
  login: "kk",
  displayName: "Константин К.",
  email: "kk@example.com",
  avatarUrl: null,
  initials: "КК",
}

describe("userSchema", () => {
  it("парсит валидного пользователя (avatarUrl: null)", () => {
    expect(userSchema.safeParse(user).success).toBe(true)
  })

  it("допускает avatarUrl как URL и отсутствие поля", () => {
    expect(
      userSchema.safeParse({ ...user, avatarUrl: "https://x/a.png" }).success
    ).toBe(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { avatarUrl: _a, ...withoutAvatar } = user
    expect(userSchema.safeParse(withoutAvatar).success).toBe(true)
  })

  it("отклоняет невалидный avatarUrl", () => {
    expect(userSchema.safeParse({ ...user, avatarUrl: "noturl" }).success).toBe(
      false
    )
  })

  it("отклоняет невалидный email", () => {
    expect(userSchema.safeParse({ ...user, email: "нет" }).success).toBe(false)
  })

  it("отклоняет отсутствие обязательного поля", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { displayName: _d, ...withoutName } = user

    expect(userSchema.safeParse(withoutName).success).toBe(false)
  })
})
