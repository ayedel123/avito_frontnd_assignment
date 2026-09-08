import { Skeleton } from "@/shared/components/shadcn/skeleton"
import { Separator } from "@base-ui/react"

export const RoomInfoSkeleton = () => (
  <div className="rounded-xl border bg-card p-6">
    <Skeleton className="h-7 w-40" />
    <Skeleton className="mt-3 h-4 w-56 max-w-full" />

    <Separator className="my-4" />

    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <Skeleton className="h-4 w-48 max-w-full" />
        </div>
      ))}
    </div>
  </div>
)
