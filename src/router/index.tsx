import { createBrowserRouter, Navigate } from "react-router-dom"
import Layout from "@/pages/layout"
import NotFoundPage from "@/pages/NotFoundPage"
import DashboardPage from "@/modules/common/pages/DashboardPage"
import LoginPage from "@/modules/login/pages/LoginPage"
import CustomersPage from "@/modules/customer/pages/CustomersPage"
import UsersPage from "@/modules/user/pages/UsersPage"
import CenterCostPage from "@/modules/centrocosto/pages/CenterCostPage"
import OrdenPage from "@/modules/order/pages/OrdenPage"
import DespachoPage from "@/modules/despacho/pages/DespachoPage"
import DescargaPage from "@/modules/descargas/pages/DescargaPage"
import ConfirmacionPage from "@/modules/confirmaciones/pages/ConfirmacionPage"
import { ProtectedRoute } from "./ProtectedRoute"
import ManifiestoPage from "@/modules/manifiesto/pages/ManifiestoPage";


export const router = createBrowserRouter([
  // Ruta pública: Login
  {
    path: "/login",
    element: <LoginPage />,
  },

  // Rutas protegidas: con Layout (sidebar)
  {
    path: "/",
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      { element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "clientes", element: <CustomersPage /> },
      { path: "usuarios", element: <UsersPage /> },
      { path: "centrocosto", element: <CenterCostPage /> },
      { path: "ordenes", element: <OrdenPage /> },
      { path: "manifiesto", element: <ManifiestoPage />},
      { path: "despacho", element: <DespachoPage /> },
      { path: "descargas", element: <DescargaPage /> },
      { path: "confirmaciones", element: <ConfirmacionPage /> },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
])
