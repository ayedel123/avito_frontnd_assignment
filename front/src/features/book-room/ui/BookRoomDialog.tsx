import type { RoomItem } from "@/entities/room/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/shared/components/shadcn/alert-dialog"
import { Dialog, DialogContent } from "@/shared/components/shadcn/dialog"
import { TriangleAlert } from "lucide-react"
import { useState } from "react"
import { useBookRoomMutation } from "../hooks/useBookRoomMutation"
import { BookRoomForm } from "./BookRoomForm"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  room: RoomItem | null
}


export const BookRoomDialog = ({ open, setOpen, room }: Props) => {
  const mutation = useBookRoomMutation(room?.id || "")
  const [conflictOpen, setConflictOpen] = useState(false)

  const handleConflict = () => {
    setOpen(false)
    setConflictOpen(true)
  }

  const handleConflictClose = () => {
    setConflictOpen(false)
    mutation.reset()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex pl-5 max-h-[80vh] flex-col">
          {room && (
            <BookRoomForm
              room={room}
              mutation={mutation}
              onClose={() => setOpen(false)}
              onConflict={handleConflict}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={conflictOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleConflictClose()
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="size-16 rounded-full bg-destructive/10">
              <TriangleAlert className="size-8 text-destructive" />
            </AlertDialogMedia>

            <AlertDialogTitle className="text-lg">
              Время уже занято
            </AlertDialogTitle>

            <AlertDialogDescription>
              Выбранный интервал был забронирован другим сотрудником. Расписание
              обновлено.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogAction
            onClick={handleConflictClose}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Выбрать другое время
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
