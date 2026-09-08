import {
  Check,
  PencilLine,
  Tv,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react"
import { Separator } from "@/shared/components/shadcn/separator"
import type { RoomItem } from "../types"

const FEATURE_ICONS: Record<string, LucideIcon> = {
  projector: Tv,
  tv: Tv,
  screen: Tv,
  whiteboard: PencilLine,
  board: PencilLine,
  marker_board: PencilLine,
  video: Video,
  videoconference: Video,
  video_conference: Video,
}

const featureIcon = (code: string): LucideIcon => FEATURE_ICONS[code] ?? Check

interface Props {
  room: RoomItem
}

export const RoomInfo = ({ room }: Props) => (
  <div className="rounded-xl border bg-card p-6">
    <h1 className="text-2xl font-bold tracking-tight">{room.name}</h1>
    <p className="mt-1 text-sm text-muted-foreground">
      {room.office.name} · {room.office.address}
    </p>

    <Separator className="my-4" />

    <ul className="flex flex-col gap-3 text-sm">
      <li className="flex items-center gap-3">
        <Users className="size-5 shrink-0 text-primary" />
        Вместимость: до {room.capacity} человек
      </li>
      {room.features.map((feature) => {
        const Icon = featureIcon(feature.code)
        return (
          <li key={feature.code} className="flex items-center gap-3">
            <Icon className="size-5 shrink-0 text-primary" />
            {feature.name}
          </li>
        )
      })}
    </ul>
  </div>
)
