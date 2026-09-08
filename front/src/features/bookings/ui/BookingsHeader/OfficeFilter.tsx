import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select"
import { Skeleton } from "@/shared/components/shadcn/skeleton"
import { useOffices } from "@/entities/office/hooks"
import { useQueryState } from "nuqs"

export const OfficeFilter = () => {
  const { isLoading, isError, data } = useOffices()
  const [officeId, setOfficeId] = useQueryState("office")

  if (isLoading) return <Skeleton className="h-9 w-32" />
  if (isError || !data)
    return (
      <Select>
        <SelectTrigger aria-invalid>
          <SelectValue placeholder="Офисы не пришли(" />
        </SelectTrigger>
      </Select>
    )
  return (
    <div>
      <Select value={officeId} onValueChange={(value) => setOfficeId(value)}>
        <SelectTrigger>
          <SelectValue>
            {(value) => (value ? data.byId[value]?.name : "Все офисы")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>{"Все офисы"}</SelectItem>
          {data.items.map((el) => (
            <SelectItem key={el.id} value={el.id}>
              {el.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
