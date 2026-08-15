import { Navigate } from "react-router-dom";
import { Lock, User } from "lucide-react"
import logoJessval from "../../../assets/logo-jessval.png"; // Importa el logo de la empresa
import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginPage() {
  const token = localStorage.getItem("token");

  const {
    userName,
    setUserName,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLoginForm();

  // Si ya está logueado, redirigir al dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
        {/* Barra de acento superior */}
        <div className="h-2 bg-red-600" />

        <div className="p-8 sm:p-10">
          {/* Sección de Branding */}
          <div className="mb-8 text-center">
            <img
              src={logoJessval}
              alt="Jessval Courier Logo"
              className="mx-auto h-18 w-60 object-contain"
            />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Campo: Correo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 pl-1">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 group-focus-within:text-red-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ingrese su usuario"
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-sm outline-none ring-red-600/10 transition-all focus:border-red-600 focus:bg-white focus:ring-4"
                />
              </div>
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Contraseña
                </label>
                <button type="button" className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline">
                  ¿Olvido su clave?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 group-focus-within:text-red-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-sm outline-none ring-red-600/10 transition-all focus:border-red-600 focus:bg-white focus:ring-4"
                />
              </div>
            </div>

            {error && (
              <p className="text-center text-xs font-bold text-red-600">{error}</p>
            )}
            <div>
              {/* Botón de Acción */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-700 border-2 border-red-800 py-4 cursor-pointer font-black uppercase  text-white shadow-xl transition-all hover:bg-red-900 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ingresando..." : "Ingresar al portal"}
              </button>
            </div>

          </form>
          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
            © {new Date().getFullYear()} Jessval Courier Logístico S.A.
          </p>
        </div>
      </div>
    </div>
  )
}
