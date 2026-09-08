import { beforeEach, describe, expect, it } from "vitest"
import { addRule, readRules, removeRule, writeRules } from "./storage"
import type { RecurringRule } from "./types"

const rule = (id: string): RecurringRule => ({
  id,
  roomId: "r1",
  roomName: "Эверест",
  timezone: "Europe/Moscow",
  title: "Daily",
  comment: "",
  time: "10:00",
  durationMinutes: 60,
  mode: "weekly",
  weekday: 1,
  dayOfMonth: 1,
  nextDate: "2026-11-09",
})

beforeEach(() => {
  localStorage.clear()
})

describe("recurring storage", () => {
  it("пустой стор → []", () => {
    expect(readRules()).toEqual([])
  })

  it("addRule добавляет, readRules читает", () => {
    addRule(rule("a"))
    addRule(rule("b"))
    expect(readRules().map((r) => r.id)).toEqual(["a", "b"])
  })

  it("removeRule удаляет по id", () => {
    writeRules([rule("a"), rule("b")])
    removeRule("a")
    expect(readRules().map((r) => r.id)).toEqual(["b"])
  })

  it("битый JSON → [] без исключения", () => {
    localStorage.setItem("bookroom:recurring:v1", "{ не json")
    expect(readRules()).toEqual([])
  })
})
