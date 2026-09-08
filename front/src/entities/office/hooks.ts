import { useQuery } from "@tanstack/react-query"
import { getOffices } from "./api"
import type { OfficeItem, Offices } from "./types"
import { useQueryState } from "nuqs"

export const QK_USE_OFFICES = "QK_USE_OFFICES"

type OfficesData = {
  items: OfficeItem[]
  byId: Record<string, OfficeItem>
}

const selectOffices = (data: Offices): OfficesData => ({
  items: data.items,
  byId: Object.fromEntries(data.items.map((office) => [office.id, office])),
})

export const useOffices = () =>
  useQuery({
    queryKey: [QK_USE_OFFICES],
    queryFn: getOffices,
    select: selectOffices,
  })

export const useSelectedOffice = () => {
  const [officeId, setOfficeId] = useQueryState("office")
  const { data, isLoading, isError, isStale } = useOffices()

  const office = data?.byId[officeId || ""]

  return { officeId, isStale, setOfficeId, office, isLoading, isError }
}
