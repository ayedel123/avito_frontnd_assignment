import { Skeleton } from "@/shared/components/shadcn/skeleton"

export const BookingCardSkeleton = () => (
  <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
    <Skeleton className="size-11 shrink-0 rounded-lg" />

    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Skeleton className="h-4 w-64 max-w-full" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <span className="size-1 shrink-0 rounded-full bg-muted" />
        <Skeleton className="h-3 w-16" />
        <span className="size-1 shrink-0 rounded-full bg-muted" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>

    <Skeleton className="h-8 w-20 shrink-0" />
  </div>
)
