import { Skeleton } from "@/shared/components/shadcn/skeleton"

export const RoomCardSkeleton = () => (
  <div className="rounded-xl border bg-card p-4">
    {/* Заголовок + подзаголовок */}
    <Skeleton className="h-6 w-44" />
    <Skeleton className="mt-2 h-4 w-24" />

    {/* Строки с иконкой и текстом */}
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-3">
        <Skeleton className="size-4 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="size-4 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
    </div>

    {/* Широкий блок */}
    <Skeleton className="mt-4 h-10 w-full" />

    {/* Два блока в ряд */}
    <div className="mt-3 flex gap-4">
      <Skeleton className="h-11 flex-1" />
      <Skeleton className="h-11 flex-1" />
    </div>
  </div>
)
