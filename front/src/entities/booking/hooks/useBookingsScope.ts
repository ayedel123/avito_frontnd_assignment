import { parseAsStringLiteral, useQueryState } from "nuqs"

export const BOOKING_SCOPES = ["upcoming", "past"] as const
export type BookingScope = (typeof BOOKING_SCOPES)[number]

export const useBookingsScope = () =>
  useQueryState(
    "scope",
    parseAsStringLiteral(BOOKING_SCOPES).withDefault("upcoming")
  )
