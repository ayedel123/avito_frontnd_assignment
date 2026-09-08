import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/shadcn/empty"
import { Button } from "@/shared/components/shadcn/button"
import { TriangleAlert } from "lucide-react"

interface Props {
  onRetry?: () => void
}

export const BookingsError = ({ onRetry }: Props) => (
  <Empty>
    <EmptyMedia className="size-24 rounded-full bg-destructive/10">
      <TriangleAlert className="size-12 text-destructive" />
    </EmptyMedia>
    <EmptyTitle>Не удалось загрузить данные</EmptyTitle>
    <EmptyDescription>
      Произошла ошибка при загрузке ваших бронирований
    </EmptyDescription>
    <EmptyContent>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={onRetry}
      >
        Попробовать снова
      </Button>
    </EmptyContent>
  </Empty>
)
