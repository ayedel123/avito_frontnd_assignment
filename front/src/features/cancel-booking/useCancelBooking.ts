import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { cancelBooking } from "@/entities/booking/api"
import { QK_USE_BOOKINGS } from "@/entities/booking/hooks/useBookings"
import { QK_USE_ROOMS } from "@/entities/room/hooks"
import { QK_USE_ROOM_SCHEDULE } from "@/entities/room/useRoomSchedule"
import { formatBookingSummary } from "@/shared/lib/formatBookingSummary"
import type { UserBooking } from "@/entities/booking/types"

export const MK_CANCEL_BOOKING = "MK_CANCEL_BOOKING"

type Snapshot = [readonly unknown[], UserBooking[] | undefined][]

const removeById = (id: string) => (old: UserBooking[] | undefined) =>
  Array.isArray(old) ? old.filter((booking) => booking.id !== id) : old

const findBooking = (snapshots: Snapshot[], id: string) =>
  snapshots
    .flat()
    .flatMap(([, data]) => data ?? [])
    .find((booking) => booking.id === id)

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MK_CANCEL_BOOKING],
    mutationFn: cancelBooking,

    onMutate: async (bookingId: string) => {
      await queryClient.cancelQueries({ queryKey: [QK_USE_BOOKINGS] })
      await queryClient.cancelQueries({ queryKey: [QK_USE_ROOM_SCHEDULE] })

      const prevBookings = queryClient.getQueriesData<UserBooking[]>({
        queryKey: [QK_USE_BOOKINGS],
      }) as Snapshot
      const prevSchedule = queryClient.getQueriesData<UserBooking[]>({
        queryKey: [QK_USE_ROOM_SCHEDULE],
      }) as Snapshot

      queryClient.setQueriesData(
        { queryKey: [QK_USE_BOOKINGS] },
        removeById(bookingId)
      )
      queryClient.setQueriesData(
        { queryKey: [QK_USE_ROOM_SCHEDULE] },
        removeById(bookingId)
      )

      const booking = findBooking([prevBookings, prevSchedule], bookingId)

      return { prevBookings, prevSchedule, booking }
    },

    onSuccess: (_data, _bookingId, context) => {
      const booking = context?.booking
      toast.success("Бронирование отменено", {
        description: booking
          ? formatBookingSummary(
              booking.room.name,
              new Date(booking.startsAt),
              new Date(booking.endsAt),
              booking.office.timezone
            )
          : undefined,
      })
    },

    onError: (_error, _bookingId, context) => {
      context?.prevBookings.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      )
      context?.prevSchedule.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      )

      toast.error("Не удалось отменить бронирование", {
        description: "Попробуйте ещё раз",
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QK_USE_BOOKINGS] })
      queryClient.invalidateQueries({ queryKey: [QK_USE_ROOMS] })
      queryClient.invalidateQueries({ queryKey: [QK_USE_ROOM_SCHEDULE] })
    },
  })
}
