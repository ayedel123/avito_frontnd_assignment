import { Skeleton } from "@/shared/components/shadcn/skeleton"
import { ScheduleGrid } from "./RoomSchedule"

export const RoomScheduleSkeleton = () => (
  <div className="rounded-xl border bg-card p-6">
    <div className="mb-4 flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>

    <ScheduleGrid disabled />

    <div className="mt-4 flex justify-end">
      <Skeleton className="h-9 w-44" />
    </div>
  </div>
)
