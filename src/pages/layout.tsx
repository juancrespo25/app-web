/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react"
import { Outlet, Navigate, useNavigate } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/modules/common/components/app-sidebar"
import { Truck, Bell, User, ChevronDown } from "lucide-react"
import logoJessval from "@/assets/logo-jessval.png"
import styles from "./pages.module.css"

export default function Layout() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Extraer información del usuario desde el token de forma segura
  const userData = (() => {
    try {
      if (!token) return null

      const base64Url = token.split(".")[1]
      if (!base64Url) return null

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )

      const payload = JSON.parse(jsonPayload)
      return {
        name: payload.nombres,
        lastName: payload.apellidos,
        email: payload.email || "sin@correo.com",
        codigo: payload.codigo,
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error)
      return null
    }
  })()

  useEffect(() => {
    if (userData?.codigo) {
      localStorage.setItem("user_code", userData.codigo)
    }
  }, [userData])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_code")
    navigate("/login", { replace: true })
  }

  return (
    <SidebarProvider>
      <div className={styles.wrapper}>

        {/* ── Cabecera ──────────────────────────────────── */}
        <header className={styles.header}>

          {/* Izquierda: logo */}
          <div className={styles.headerLeft}>
            <div className={styles.headerLogoWrap}>
              <img src={logoJessval} alt="Jessval Courier" className={styles.headerLogoImg} />
            </div>
          </div>

          {/* Centro: separador decorativo */}
          <div className={styles.headerSeparator} />

          {/* Derecha: notificaciones + usuario */}
          <div className={styles.headerRight}>
            {/* Campana */}
            <button className={styles.headerBellBtn}>
              <Bell className="h-4 w-4" />
              <span className={styles.headerBellDot} />
            </button>

            {/* Divisor */}
            <div className={styles.headerDividerSmall} />

            {/* Usuario */}
            <div className={styles.headerUser}>
              <div className={styles.headerUserAvatar}>
                <User className="h-4 w-4" />
              </div>
              <div className={styles.headerUserInfo}>
                <p className={styles.headerUserName}>{userData?.name || "Administrador"}</p>
                <p className={styles.headerUserEmail}>{userData?.email || "admin@jessval.com"}</p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline ml-3 cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
              <ChevronDown className={styles.headerChevron} />
            </div>
          </div>
        </header>

        {/* ── Cuerpo: sidebar + toggle + contenido ──────── */}
        <div className={styles.body}>
          <AppSidebar />

          {/* Toggle flotante pegado al borde del sidebar */}
          <div className={styles.triggerWrap}>
            <SidebarTrigger className="rounded-r-lg border border-l-0 border-gray-200 bg-white p-1.5 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors" />
          </div>

          <main className={styles.main}>
            <Outlet />
          </main>
        </div>

        {/* ── Pie de página ─────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerIconWrap}>
              <Truck className="h-2.5 w-2.5 text-white" />
            </div>
            <span>© {new Date().getFullYear()} <span className={styles.footerBrand}>Jessval Courier</span> — Todos los derechos reservados</span>
          </div>
        </footer>

      </div>
    </SidebarProvider>
  )
}