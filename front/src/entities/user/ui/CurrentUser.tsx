import { Skeleton } from "@/shared/components/shadcn/skeleton"
import { useUser } from "../hooks"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn/avatar"

interface Props {
  className?: string
}

export const CurrentUser = ({ className }: Props) => {
  const { isLoading, isError, data: user } = useUser()
  if (isLoading) return <Skeleton className="h-9 w-32" />
  if (!user || isError)
    return <div className={className}>Пользователь не найден</div>
  return (
    <div className="flex items-center gap-4">
      <p className="text-md hidden sm:inline">{user.displayName}</p>
      <Avatar>
        <AvatarImage src={user.avatarUrl || ""} alt={user.displayName} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
    </div>
  )
}
