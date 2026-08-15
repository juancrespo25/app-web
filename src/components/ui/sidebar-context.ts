import * as React from "react"

interface SidebarContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider")
  return ctx
}
