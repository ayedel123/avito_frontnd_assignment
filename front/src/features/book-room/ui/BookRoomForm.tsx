import type { RoomItem } from "@/entities/room/types"
import { Button } from "@/shared/components/shadcn/button"
import { Calendar } from "@/shared/components/shadcn/calendar"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn/dialog"
import { Field, FieldGroup, FieldLabel } from "@/shared/components/shadcn/field"
import { Input } from "@/shared/components/shadcn/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/shadcn/popover"
import { Separator } from "@/shared/components/shadcn/separator"
import { DurationPicker } from "@/shared/components/ui/DurationPicker"
import { TimePicker } from "@/shared/components/ui/TimePicker"
import { START_HOURS } from "@/shared/config/workday"
import { formatDuration } from "@/shared/lib/duration"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, Info } from "lucide-react"
import { useBookRoom } from "../hooks/useBookRoom"
import { useBookRoomMutation } from "../hooks/useBookRoomMutation"
import type { RepeatMode } from "@/features/recurring-booking/types"

interface FormProps {
  room: RoomItem
  mutation: ReturnType<typeof useBookRoomMutation>
  onClose: () => void
  onConflict: () => void
}

const REPEAT_OPTIONS: { value: RepeatMode; label: string }[] = [
  { value: "none", label: "Не повторять" },
  { value: "weekly", label: "Каждую неделю" },
  { value: "monthly", label: "Каждый месяц" },
]

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

export const BookRoomForm = ({
  room,
  mutation,
  onClose,
  onConflict,
}: FormProps) => {
  const {
    title,
    setTitle,
    comment,
    setComment,
    date,
    setDate,
    time,
    setTime,
    duration,
    setDuration,
    dateOpen,
    setDateOpen,
    repeat,
    setRepeat,
    minDate,
    maxDate,
    startMax,
    maxDurationMinutes,
    end,
    canSubmit,
    isPending,
    errorMessage,
    onSubmit,
  } = useBookRoom({
    room,
    mutation,
    onClose,
    onConflict,
  })

  return (
    <>
      <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col gap-4 ">
        <DialogHeader>
          <DialogTitle className="text-lg">Новое бронирование</DialogTitle>
          <DialogDescription>
            Переговорная: <b className="text-primary">{room.name}</b> (
            {room.office.name}, {room.floor} этаж)
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">
                Тема встречи <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Например, Daily Sync"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Дата</FieldLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className="min-w-0 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        <span className="truncate">
                          {date
                            ? format(date, "d MMMM, EEEEEE", { locale: ru })
                            : "Выберите дату"}
                        </span>
                        <CalendarIcon data-icon="inline-end" />
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={ru}
                      selected={date ?? undefined}
                      onSelect={(value) => {
                        setDate(value ?? null)
                        setDateOpen(false)
                      }}
                      defaultMonth={date ?? minDate}
                      startMonth={minDate}
                      endMonth={maxDate}
                      disabled={[{ before: minDate }, { after: maxDate }]}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel>Время начала</FieldLabel>
                <TimePicker
                  value={time}
                  onChange={setTime}
                  hours={START_HOURS}
                  max={startMax}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Продолжительность</FieldLabel>
              <DurationPicker
                value={duration}
                onChange={setDuration}
                maxMinutes={maxDurationMinutes}
              />
            </Field>

            <Field>
              <FieldLabel>Повторение</FieldLabel>
              <div className="flex flex-wrap gap-1 rounded-lg border border-input p-1">
                {REPEAT_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={repeat === option.value ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setRepeat(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              {repeat !== "none" && date && (
                <p className="text-xs text-muted-foreground">
                  {repeat === "weekly"
                    ? `Каждую неделю по ${format(date, "EEEE", { locale: ru })}`
                    : `${format(date, "d", { locale: ru })}-го числа каждого месяца`}
                  . В пределах 30 дней слоты бронируются сразу, бронирования
                  автоматически продлеваются при следующем открытии приложения.
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="comment">Комментарий</FieldLabel>
              <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Дополнительная информация для участников встречи…"
                className="min-h-20 w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>
          </FieldGroup>

          {date && time && end && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm text-primary">
              <Info className="size-4 shrink-0" />
              <span>
                Бронирование на{" "}
                {capitalize(format(date, "EEEE, d MMMM", { locale: ru }))},{" "}
                {time} – {end}
                {duration ? ` (${formatDuration(duration)})` : ""}
              </span>
            </div>
          )}

          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Отмена
          </DialogClose>
          <Button
            type="submit"
            disabled={!canSubmit || isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? "Бронируем…" : "Забронировать"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
