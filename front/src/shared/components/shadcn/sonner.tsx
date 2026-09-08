import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useTheme } from "@/shared/components/theme-provider"

export const Toaster = (props: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      {...props}
    />
  )
}
