import * as React from "react"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarContext, useSidebar } from "./sidebar-context"

// ─── Provider ───────────────────────────────────────────────────────────────

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const toggleSidebar = () => setOpen((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { open, toggleSidebar } = useSidebar()

  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar: fixed en móvil, relativo en desktop */}
      <aside
        data-state={open ? "expanded" : "collapsed"}
        className={cn(
          "flex flex-col border-r border-gray-200 bg-white transition-all duration-300 shrink-0 z-40",
          // Móvil: posición fija, cubre toda la pantalla
          "fixed inset-y-0 left-0 h-screen sm:relative sm:inset-auto sm:h-full",
          open ? "w-64 translate-x-0" : "w-64 -translate-x-full sm:w-0 sm:translate-x-0 sm:overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  )
}

// ─── SidebarHeader ──────────────────────────────────────────────────────────

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2 border-b border-gray-200 px-4 py-4", className)}
      {...props}
    />
  )
}

// ─── SidebarContent ─────────────────────────────────────────────────────────

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-3 py-2", className)}
      {...props}
    />
  )
}

// ─── SidebarFooter ──────────────────────────────────────────────────────────

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-t border-gray-200 px-4 py-4", className)}
      {...props}
    />
  )
}

// ─── SidebarGroup ───────────────────────────────────────────────────────────

export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />
}

// ─── SidebarGroupLabel ──────────────────────────────────────────────────────

export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-900",
        className
      )}
      {...props}
    />
  )
}

// ─── SidebarGroupContent ────────────────────────────────────────────────────

export function SidebarGroupContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />
}

// ─── SidebarMenu ────────────────────────────────────────────────────────────

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

// ─── SidebarMenuItem ────────────────────────────────────────────────────────

export function SidebarMenuItem({
  className,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("list-none", className)} {...props} />
}

// ─── SidebarMenuButton ──────────────────────────────────────────────────────

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild = false, isActive, tooltip, children, ...props }, ref) => {
  const baseClass = cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-red-50 text-red-600 font-semibold"
      : "text-red-600 hover:bg-red-50 hover:text-red-700",
    className
  )

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>
    return React.cloneElement(child, {
      className: cn(baseClass, child.props.className),
    })
  }

  return (
    <button ref={ref} className={baseClass} title={tooltip} {...props}>
      {children}
    </button>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

// ─── SidebarTrigger ─────────────────────────────────────────────────────────

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors",
        className
      )}
      aria-label="Toggle sidebar"
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
    </button>
  )
}
