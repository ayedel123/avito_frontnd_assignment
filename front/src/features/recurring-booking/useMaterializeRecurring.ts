import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { BOOKING_WINDOW_DAYS } from "@/shared/config/workday"
import { getTodayInTimeZone } from "@/shared/lib/getTodayInTimeZone"
import { QK_USE_ROOMS } from "@/entities/room/hooks"
import { QK_USE_ROOM_SCHEDULE } from "@/entities/room/useRoomSchedule"
import { QK_USE_BOOKINGS } from "@/entities/booking/hooks/useBookings"
import { addDays, collectUntil, fromDateKey, toDateKey } from "./occurrences"
import { fireSeries } from "./materialize"
import { readRules, writeRules } from "./storage"

export const useMaterializeRecurring = () => {
  const queryClient = useQueryClient()
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    const run = async () => {
      const rules = readRules()
      if (rules.length === 0) return

      let changed = false
      let anyCreated = false

      for (const rule of rules) {
        const today = getTodayInTimeZone(rule.timezone)
        const windowEnd = addDays(today, BOOKING_WINDOW_DAYS)
        const from = fromDateKey(rule.nextDate)

        if (from.getTime() > windowEnd.getTime()) continue

        const anchor = {
          mode: rule.mode,
          weekday: rule.weekday,
          dayOfMonth: rule.dayOfMonth,
        }
        const { dates, next } = collectUntil(anchor, from, windowEnd)
    
        const due = dates.filter((date) => date.getTime() >= today.getTime())

        if (due.length > 0) {
          const result = await fireSeries(rule, due)
          anyCreated = anyCreated || result.created > 0
          if (result.created > 0) {
            toast.success(`Добронированы даты серии «${rule.title}»`, {
              description: `Комната ${rule.roomName}: создано ${result.created}${
                result.conflict > 0 ? `, занято ${result.conflict}` : ""
              }`,
            })
          }
        }

        rule.nextDate = toDateKey(next)
        changed = true
      }

      if (changed) writeRules(rules)
      if (anyCreated) {
        queryClient.invalidateQueries({ queryKey: [QK_USE_ROOMS] })
        queryClient.invalidateQueries({ queryKey: [QK_USE_ROOM_SCHEDULE] })
        queryClient.invalidateQueries({ queryKey: [QK_USE_BOOKINGS] })
      }
    }

    void run()
  }, [queryClient])
}
