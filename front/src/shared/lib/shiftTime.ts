export const shiftTime = (
  time: string | null,
  delta: number
): string | null => {
  if (!time) return null
  const [hour, minute] = time.split(":").map(Number)
  const total = hour * 60 + minute + delta
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60
  ).padStart(2, "0")}`
}
