import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getRoom, getRooms } from "./api"
import type { RoomItem, Rooms } from "./types"
import { useSelectedOffice } from "@/entities/office/hooks"
import { useRoomsFilters } from "@/entities/rooms-filter/hooks"
import { toIsoWithOffset } from "@/shared/lib/timeUtils"

export const QK_USE_ROOMS = "QK_USE_ROOMS"
export const QK_USE_ROOM = "QK_USE_ROOM"

export const useRoom = (roomId: string) =>
  useQuery({
    queryKey: [QK_USE_ROOM, roomId],
    queryFn: () => getRoom(roomId),
  })

type RoomsData = {
  items: RoomItem[]
  byId: Record<string, RoomItem>
}

const selectRooms = (data: Rooms): RoomsData => ({
  items: data.items,
  byId: Object.fromEntries(data.items.map((room) => [room.id, room])),
})

export const useRooms = () => {
  const { officeId, office } = useSelectedOffice()
  const { date, time, end, capacity } = useRoomsFilters()

  const timeZone =
    office?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const from = toIsoWithOffset(date, time, timeZone)
  const to = toIsoWithOffset(date, end, timeZone)

  const hasInterval = Boolean(from) && Boolean(to)
  const partialInterval = Boolean(from) !== Boolean(to)

  const query = useQuery({
    queryKey: [
      QK_USE_ROOMS,
      officeId,
      capacity,
      hasInterval ? from : null,
      hasInterval ? to : null,
    ],
    queryFn: () =>
      getRooms({
        officeId: officeId!,
        minCapacity: capacity ?? undefined,
        ...(hasInterval ? { from, to } : {}),
      }),
    enabled: Boolean(officeId) && !partialInterval,
    placeholderData: keepPreviousData,
    select: selectRooms,
  })

  return { ...query, partialInterval }
}
