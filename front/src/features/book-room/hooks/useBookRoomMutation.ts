import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { QK_USE_ROOMS } from "@/entities/room/hooks"
import { QK_USE_ROOM_SCHEDULE } from "@/entities/room/useRoomSchedule"
import { QK_USE_BOOKINGS } from "@/entities/booking/hooks/useBookings"
import { bookRoom } from "@/entities/booking/api"

export const MK_USE_BOOK_ROOM = "MK_USE_BOOK_ROOM"

export const useBookRoomMutation = (roomId: string) => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [QK_USE_ROOMS] })
    queryClient.invalidateQueries({ queryKey: [QK_USE_ROOM_SCHEDULE] })
    queryClient.invalidateQueries({ queryKey: [QK_USE_BOOKINGS] })
  }

  return useMutation({
    mutationKey: [MK_USE_BOOK_ROOM, roomId],
    mutationFn: bookRoom,
    onSuccess: invalidate,
    onError: (error) => {
      // при 409 расписание/доступность изменились — синхронизируем
      if (isAxiosError(error) && error.status === 409) {
        invalidate()
      }
    },
  })
}
