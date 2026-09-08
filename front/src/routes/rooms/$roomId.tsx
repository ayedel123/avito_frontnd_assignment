import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronRight, TriangleAlert } from "lucide-react"
import { useRoom } from "@/entities/room/hooks"
import { RoomInfo } from "@/entities/room/ui/RoomInfo"
import { RoomInfoSkeleton } from "@/entities/room/ui/RoomInfoSkeleton"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/shadcn/empty"
import { Button } from "@/shared/components/shadcn/button"
import { Skeleton } from "@/shared/components/shadcn/skeleton"
import { RoomSchedule } from "@/features/room-schedule/RoomSchedule"
import { RoomScheduleSkeleton } from "@/features/room-schedule/RoomScheduleSkeleton"

export const Route = createFileRoute("/rooms/$roomId")({
  component: RoomPage,
})

const LAYOUT = "grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_1fr]"

function RoomPage() {
  const { roomId } = Route.useParams()
  const { data: room, isLoading, isError, refetch } = useRoom(roomId)

  if (isLoading)
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <ChevronRight className="size-4 text-muted-foreground" />
          <Skeleton className="h-4 w-28" />
          <ChevronRight className="size-4 text-muted-foreground" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className={LAYOUT}>
          <RoomInfoSkeleton />
          <RoomScheduleSkeleton />
        </div>
      </div>
    )

  if (isError || !room)
    return (
      <Empty>
        <EmptyMedia className="size-24 rounded-full bg-destructive/10">
          <TriangleAlert className="size-12 text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Не удалось загрузить переговорную</EmptyTitle>
        <EmptyDescription>
          Проверьте ссылку или попробуйте ещё раз
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

  return (
    <div className="flex w-full flex-col gap-4">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/rooms" className="hover:text-foreground">
          Переговорные
        </Link>
        <ChevronRight className="size-4" />
        <Link
          to="/rooms"
          search={{ office: room.officeId }}
          className="hover:text-foreground"
        >
          {room.office.name}
        </Link>
        <ChevronRight className="size-4" />
        <span className="font-medium text-foreground">
          Комната «{room.name}»
        </span>
      </nav>

      <div className={LAYOUT}>
        <RoomInfo room={room} />
        <RoomSchedule room={room} />
      </div>
    </div>
  )
}
