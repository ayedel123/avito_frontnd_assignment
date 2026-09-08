import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/shadcn/empty"
import { Button } from "@/shared/components/shadcn/button"
import { Link } from "@tanstack/react-router"
import { Flag } from "lucide-react"

interface Props {
  description?: string
}

export const BookingsEmpty = ({
  description = "У вас пока нет предстоящих бронирований. Перейдите в раздел переговорных, чтобы забронировать комнату.",
}: Props) => (
  <Empty>
    <EmptyMedia className="size-24 rounded-full bg-primary/10">
      <Flag className="size-12 text-primary" />
    </EmptyMedia>
    <EmptyTitle>Нет бронирований</EmptyTitle>
    <EmptyDescription>{description}</EmptyDescription>
    <EmptyContent>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        render={<Link to="/rooms" />}
      >
        Перейти к переговорным
      </Button>
    </EmptyContent>
  </Empty>
)
