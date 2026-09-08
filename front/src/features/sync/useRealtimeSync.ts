import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { QK_USE_ROOMS } from "@/entities/room/hooks"
import { QK_USE_ROOM_SCHEDULE } from "@/entities/room/useRoomSchedule"
import { QK_USE_BOOKINGS } from "@/entities/booking/hooks/useBookings"

const RECONNECT_DELAY_MS = 3000

const REALTIME_EVENTS = new Set([
  "booking.created",
  "booking.cancelled",
  "room.availability_changed",
  "data.reset",
])

interface RealtimeEvent {
  type: string
  occurredAt: string
  data: Record<string, unknown>
}

const getWebSocketUrl = () => {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1"
  if (base.startsWith("http")) {
    return `${base.replace(/^http/, "ws")}/ws`
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
  return `${protocol}//${window.location.host}${base}/ws`
}

export type RealtimeStatus = "connecting" | "open" | "reconnecting"

export const useRealtimeSync = () => {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<RealtimeStatus>("connecting")

  useEffect(() => {
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined
    let stopped = false
    let wasConnected = false

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: [QK_USE_ROOMS] })
      queryClient.invalidateQueries({ queryKey: [QK_USE_ROOM_SCHEDULE] })
      queryClient.invalidateQueries({ queryKey: [QK_USE_BOOKINGS] })
    }

    const connect = () => {
      socket = new WebSocket(getWebSocketUrl())

      socket.onopen = () => {
        if (wasConnected) queryClient.invalidateQueries()
        wasConnected = true
        setStatus("open")
      }

      socket.onmessage = (message) => {
        let event: RealtimeEvent
        try {
          event = JSON.parse(message.data)
        } catch {
          return
        }
        if (REALTIME_EVENTS.has(event.type)) invalidate()
      }

      socket.onclose = () => {
        if (stopped) return
        setStatus("reconnecting")
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    connect()

    return () => {
      stopped = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socket?.close()
    }
  }, [queryClient])

  return { status }
}
