import { Link } from "@tanstack/react-router"
import { Home } from "lucide-react"
import { Button } from "@/shared/components/shadcn/button"

export const NotFound = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
    <span className="text-8xl leading-none font-extrabold tracking-tight text-primary">
      404
    </span>
    <h1 className="text-2xl font-bold">Страница не найдена</h1>
    <p className="max-w-md text-muted-foreground">
      Запрашиваемая страница не существует, была удалена или перенесена на
      другой адрес.
    </p>
    <Button
      className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
      render={<Link to="/rooms" />}
    >
      <Home className="size-4" />
      Вернуться к переговорным
    </Button>
  </div>
)
