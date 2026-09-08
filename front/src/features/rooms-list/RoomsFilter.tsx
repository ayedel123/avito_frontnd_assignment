import { Field, FieldLabel } from "@/shared/components/shadcn/field"
import {
  useCapacityFilter,
  useDurationFilter,
  useStartTimeFilter,
} from "@/entities/rooms-filter/hooks"
import { CapacityPicker } from "@/shared/components/ui/CapacityPicker"
import { DurationPicker } from "@/shared/components/ui/DurationPicker"
import { TimePicker } from "@/shared/components/ui/TimePicker"
import { RoomsDateFilter } from "./RoomsDateFilter/RoomsDateFilter"

export const RoomsFilter = () => {
  const startTime = useStartTimeFilter()
  const durationFilter = useDurationFilter()
  const { capacity, setCapacity } = useCapacityFilter()

  return (
    <div className={"flex w-full flex-wrap gap-4"}>
      <Field className="w-44">
        <FieldLabel>Дата</FieldLabel>
        <RoomsDateFilter />
      </Field>

      <Field className="w-32">
        <FieldLabel>Начало</FieldLabel>
        <TimePicker
          value={startTime.time}
          onChange={startTime.setTime}
          hours={startTime.hours}
          max={startTime.max}
        />
      </Field>

      <Field className="w-36">
        <FieldLabel>Длительность</FieldLabel>
        <DurationPicker
          value={durationFilter.duration}
          onChange={durationFilter.setDuration}
          maxMinutes={durationFilter.maxMinutes}
        />
      </Field>

      <Field className="w-32">
        <FieldLabel>Вместимость</FieldLabel>
        <CapacityPicker value={capacity} onChange={setCapacity} />
      </Field>
    </div>
  )
}
