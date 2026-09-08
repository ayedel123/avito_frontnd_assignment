import { useSelectedOffice } from "@/entities/office/hooks"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/shadcn/empty"
import { Building, Clock, SearchX, TriangleAlert } from "lucide-react"
import { RoomCardSkeleton } from "./RoomCard/RoomCardSkeleton"
import { RoomCard } from "./RoomCard/RoomCard"
import { Button } from "@/shared/components/shadcn/button"
import { useRoomsFilters } from "@/entities/rooms-filter/hooks"
import { useRooms } from "@/entities/room/hooks"
import { BookRoomDialog } from "@/features/book-room/ui/BookRoomDialog"
import type { RoomItem } from "@/entities/room/types"
import { useState } from "react"

const GRID_CLASSES = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"

export const RoomsList = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null)

  return (
    <>
      <RoomsListCOntent
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
      />
      <BookRoomDialog
        open={selectedRoom !== null}
        setOpen={(next) => {
          if (!next) setSelectedRoom(null)
        }}
        room={selectedRoom}
      />
    </>
  )
}

interface Props {
  selectedRoom: RoomItem | null
  setSelectedRoom: (id: RoomItem) => void
}

export const RoomsListCOntent = ({ setSelectedRoom }: Props) => {
  const { officeId } = useSelectedOffice()
  const { dropFilters } = useRoomsFilters()
  const { data, isLoading, isRefetching, isError, refetch, partialInterval } =
    useRooms()

  if (!officeId)
    return (
      <Empty>
        <EmptyMedia className="size-24 rounded-full bg-primary/10">
          <Building className="size-12 text-primary" />
        </EmptyMedia>
        <EmptyHeader>Выберите офис</EmptyHeader>
        <EmptyTitle>
          Для просмотра доступных переговорных сначала выберите офис из списка
          выше
        </EmptyTitle>
      </Empty>
    )

  if (partialInterval)
    return (
      <Empty>
        <EmptyMedia className="size-24 rounded-full bg-primary/10">
          <Clock className="size-12 text-primary" />
        </EmptyMedia>
        <EmptyHeader>Укажите интервал полностью</EmptyHeader>
        <EmptyTitle>
          Чтобы увидеть доступность, выберите и начало, и конец времени
        </EmptyTitle>
      </Empty>
    )

  if (isLoading || isRefetching)
    return (
      <div className={GRID_CLASSES}>
        {Array.from({ length: 6 }).map((_, index) => (
          <RoomCardSkeleton key={index} />
        ))}
      </div>
    )

  if (isError)
    return (
      <Empty>
        <EmptyMedia className="size-24 rounded-full bg-destructive/10">
          <TriangleAlert className="size-12 text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Не удалось загрузить данные</EmptyTitle>
        <EmptyDescription>
          Произошла ошибка при загрузке списка переговорных
        </EmptyDescription>
        <EmptyContent>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => refetch()}
          >
            Попробовать снова
          </Button>
        </EmptyContent>
      </Empty>
    )

  if (!data || data.items.length === 0)
    return (
      <Empty>
        <EmptyMedia className="size-24 rounded-full bg-primary/10">
          <SearchX className="size-12 text-primary" />
        </EmptyMedia>
        <EmptyTitle>Нет доступных переговорных</EmptyTitle>
        <EmptyDescription>
          Попробуйте изменить параметры фильтрации или выбрать другой офис
        </EmptyDescription>
        <EmptyContent>
          <Button onClick={() => dropFilters()}>Сбросить фильтры</Button>
        </EmptyContent>
      </Empty>
    )

  return (
    <>
      <div className={GRID_CLASSES}>
        {data.items.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={() => setSelectedRoom(room)}
          />
        ))}
      </div>
    </>
  )
}
