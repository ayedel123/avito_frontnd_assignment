import { parseAsInteger, useQueryState } from "nuqs"

export const useCapacityFilter = () => {
  const [capacity, setCapacity] = useQueryState("capacity", parseAsInteger)
  return { capacity, setCapacity }
}
