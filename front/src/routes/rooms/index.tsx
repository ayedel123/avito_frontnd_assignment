import { createFileRoute } from "@tanstack/react-router"

import { Separator } from "@/shared/components/shadcn/separator"
import { OfficeSelect } from "@/entities/office/ui/OfficeSeelct"
import { RoomsFilter } from "@/features/rooms-list/RoomsFilter"
import { RoomsList } from "@/features/rooms-list/RoomsList"

export const Route = createFileRoute("/rooms/")({
  component: RoomsPage,
})

function RoomsPage() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 text-sm leading-loose">
      <OfficeSelect />
      <Separator />
      <RoomsFilter />
      <Separator />
      <RoomsList />
    </div>
  )
}
