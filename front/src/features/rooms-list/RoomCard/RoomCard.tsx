import { cn } from "cn"
import { Clock, Users } from "lucide-react"
import { Link } from "@tanstack/react-router"
import type { RoomItem } from "@/entities/room/types"
import { Button } from "@/shared/components/shadcn/button"

interface Props {
  room: RoomItem
  onClick: () => void
}

export const RoomCard = ({ room, onClick }: Props) => (
  <div className="flex flex-col rounded-xl border bg-card p-5">
    <h3 className="text-xl font-bold tracking-tight">{room.name}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{room.floor} этаж</p>

    <div className="mt-4 space-y-2 text-sm">
      <div className="flex items-center gap-2.5">
        <Users className="size-4 shrink-0 text-muted-foreground" />
        <span>Вместимость: до {room.capacity} человек</span>
      </div>
      {room.available !== undefined && (
        <div className="flex items-center gap-2.5">
          <Clock className="size-4 shrink-0 text-muted-foreground" />
          <span>{room.available ? "Свободна" : "Занята"}</span>
        </div>
      )}
    </div>

    {room.available !== undefined && (
      <div
        className={cn(
          "mt-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm",
          room.available
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
            : "bg-muted text-muted-foreground"
        )}
      >
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            room.available ? "bg-emerald-500" : "bg-muted-foreground"
          )}
        />
        {room.available
          ? "Доступно на выбранное время"
          : "Недоступно на выбранное время"}
      </div>
    )}

    <div className="mt-4 flex gap-3">
      <Button
        variant="ghost"
        className="flex-1 text-primary hover:text-primary/80"
        render={<Link to="/rooms/$roomId" params={{ roomId: room.id }} />}
      >
        Подробнее
      </Button>
      <Button
        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={room.available === false}
        onClick={onClick}
      >
        Забронировать
      </Button>
    </div>
  </div>
)
