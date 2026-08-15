import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    LayoutDashboard,
    Package,
    Users,
    Truck,
    ClipboardList,
    Settings,
    ChevronDown,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import styles from "./app-sidebar.module.css"

const navItems = [
    {
        label: "ATENCION AL CLIENTE",
        items: [
            { title: "Envios por cliente", url: "/envios", icon: Truck },
            { title: "Consulta de Orden", url: "/paquetes", icon: Package },
            { title: "Devolucion de cargos", url: "/paquetes", icon: Package },
        ],
    },
    {
        label: "ORDENES",
        items: [
            { title: "Orden de Servicio", url: "/ordenes", icon: ClipboardList },
        ],
    },
    {
        label: "OPERACIONES LOCAL",
        items: [
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
            { title: "Manifiesto Local", url: "/manifiesto", icon: ClipboardList }
        ],
    },
    {
        label: "DESPACHO A PROVINCIAS",
        items: [
            { title: "Despacho a Provincias", url: "/despacho", icon: Package },
        ],
    },
    {
        label: "CONFIRMACIONES",
        items: [
            { title: "Confirmacion de envios", url: "/confirmaciones", icon: Package },
            { title: "Descarga de envios", url: "/descargas", icon: Package },
        ],
    },
    {
        label: "IMPRESIONES",
        items: [
            { title: "Imprimir Guias", url: "/ordenes", icon: Users },
            { title: "Imprimir Etiquetas", url: "/ordenes", icon: Users },
        ],
    },
    {
        label: "MANTENIMIENTOS",
        items: [
            { title: "Usuarios", url: "/usuarios", icon: Users },
            { title: "Clientes", url: "/clientes", icon: Users },
            { title: "Centro de Costo", url: "/centrocosto", icon: Users },
            { title: "Empresas de Transporte", url: "/empresas-transporte", icon: Users },
            { title: "Configuración", url: "/configuracion", icon: Settings },
        ],
    },
]

export function AppSidebar() {
    const { pathname: currentPath } = useLocation()
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

    const toggleGroup = (label: string) =>
        setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }))

    return (
        <Sidebar>
            {/* ── Logo ── */}
            <SidebarHeader>
                <div className={styles.header}>
                    <div className={styles.headerLogo}>
                        <Truck className={styles.headerLogoIcon} />
                    </div>
                    <div className={styles.headerBrand}>
                        <span className={styles.headerBrandName}>Jessval</span>
                        <span className={styles.headerBrandSuffix}>Courier</span>
                    </div>
                </div>
            </SidebarHeader>

            {/* ── Navegación ── */}
            <SidebarContent>
                {navItems.map((group) => {
                    const isCollapsed = collapsed[group.label] ?? false
                    return (
                        <SidebarGroup key={group.label}>
                            {/* Label clicable */}
                            <SidebarGroupLabel
                                className={styles.groupLabel}
                                onClick={() => toggleGroup(group.label)}
                            >
                                <span>{group.label}</span>
                                <ChevronDown
                                    className={styles.groupChevron}
                                    style={{
                                        transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s",
                                    }}
                                />
                            </SidebarGroupLabel>

                            {/* Items colapsables */}
                            {!isCollapsed && (
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => {
                                            const Icon = item.icon
                                            const isActive = currentPath.startsWith(item.url)
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton asChild isActive={isActive}>
                                                        <Link
                                                            to={item.url}
                                                            className={isActive ? styles.menuLinkActive : styles.menuLink}
                                                        >
                                                            <Icon className={styles.menuIcon} />
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            )
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            )}
                        </SidebarGroup>
                    )
                })}
            </SidebarContent>

            {/* ── Footer ── */}
            <SidebarFooter>
                <div className={styles.footer}>
                    <div className={styles.footerDot} />
                    <p className={styles.footerText}>
                        © {new Date().getFullYear()} Jessval Courier
                    </p>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}