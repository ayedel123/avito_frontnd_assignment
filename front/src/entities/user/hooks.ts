import { useQuery } from "@tanstack/react-query"
import { whoami } from "./api"

export const QK_USE_USER = "QK_USE_USER"

export const useUser = () =>
  useQuery({
    queryKey: [QK_USE_USER],
    queryFn: whoami,
  })
