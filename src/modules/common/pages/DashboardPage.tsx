export default function DashboardPage() {
  return (
    <div>
      {/* Título de sección */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Bienvenido al sistema de gestión Jessval Courier.</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Envíos hoy",        value: "0", icon: "🚚", border: "border-l-red-600",  text: "text-red-600" },
          { label: "Paquetes activos",  value: "0", icon: "📦", border: "border-l-gray-700", text: "text-gray-700" },
          { label: "Clientes",          value: "0", icon: "👥", border: "border-l-red-600",  text: "text-red-600" },
          { label: "Órdenes pendientes",value: "0", icon: "📋", border: "border-l-gray-700", text: "text-gray-700" },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border-l-4 ${card.border} bg-white p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <span className="text-xl">{card.icon}</span>
            </div>
            <p className={`mt-3 text-3xl font-bold ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Sección inferior */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-1 rounded-full bg-red-600" />
            <h2 className="text-sm font-semibold text-gray-800">Actividad reciente</h2>
          </div>
          <p className="text-sm text-gray-400">No hay actividad reciente.</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-1 rounded-full bg-gray-700" />
            <h2 className="text-sm font-semibold text-gray-800">Estado del sistema</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <p className="text-sm text-gray-500">Todos los servicios operativos</p>
          </div>
        </div>
      </div>
    </div>
  )
}
