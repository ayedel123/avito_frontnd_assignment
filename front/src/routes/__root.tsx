import { useTheme } from "@/shared/components/theme-provider"
import { Button } from "@/shared/components/shadcn/button"
import { CurrentUser } from "@/entities/user/ui/CurrentUser"
import { Link, Outlet, createRootRoute } from "@tanstack/react-router"
import { CalendarCheck, Info, Moon, Sun } from "lucide-react"
import { NuqsAdapter } from "nuqs/adapters/tanstack-router"
import { NotFound } from "@/shared/components/ui/NotFound"
import { useRealtimeSync } from "@/features/sync/useRealtimeSync"
import { useMaterializeRecurring } from "@/features/recurring-booking/useMaterializeRecurring"

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  const { theme, setTheme } = useTheme()

  const { status } = useRealtimeSync()

  useMaterializeRecurring()

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <NuqsAdapter>
      <div className="flex min-h-svh w-full flex-col items-center">
        {status === "reconnecting" && (
          <div className="flex w-full items-center justify-center gap-2 bg-yellow-200 py-2 text-sm text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200">
            <Info className="size-4 shrink-0" />
            Соединение потеряно. Переподключение…
          </div>
        )}
        <header className="w-full max-w-[1600px] border-b">
          <nav className="flex w-full items-center justify-between gap-2 p-4 text-sm sm:gap-4">
            <div className="flex shrink-0 items-center gap-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
                <CalendarCheck />
              </div>

              <b className="hidden sm:inline">BookRoom</b>
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap justify-center gap-4 sm:flex-none">
              <Link
                to="/rooms"
                className="min-w-4 truncate whitespace-nowrap text-muted-foreground hover:text-foreground [&.active]:shrink-0 [&.active]:font-medium [&.active]:text-foreground"
              >
                Переговорные
              </Link>

              <Link
                to="/bookings"
                className="min-w-4 truncate whitespace-nowrap text-muted-foreground hover:text-foreground [&.active]:shrink-0 [&.active]:font-medium [&.active]:text-foreground"
              >
                Мои бронирования
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <CurrentUser />

              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="size-9"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )}
              </Button>
            </div>
          </nav>
        </header>

        <main className="w-full max-w-[1600px] flex-1 p-6">
          <Outlet />
        </main>

        {/* <TanStackRouterDevtools position="bottom-right" /> */}
      </div>
    </NuqsAdapter>
  )
}
