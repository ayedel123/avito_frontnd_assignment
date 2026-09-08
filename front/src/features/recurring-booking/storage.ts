import type { RecurringRule } from "./types"

const STORAGE_KEY = "bookroom:recurring:v1"

export const readRules = (): RecurringRule[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as RecurringRule[]) : []
  } catch {
    return []
  }
}

export const writeRules = (rules: RecurringRule[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules))
  } catch {
    console.warn("не удалось продлить бронирование")
  }
}

export const addRule = (rule: RecurringRule): void => {
  writeRules([...readRules(), rule])
}

export const removeRule = (id: string): void => {
  writeRules(readRules().filter((rule) => rule.id !== id))
}
