import { UserPlus, Eye, Trash2, ShieldCheck, Search } from "lucide-react";
import UserForm from "../components/UserForm";
import { useUsers } from "../hooks/useUsers";
import { useUserSearch } from "../hooks/useUserSearch";
import { AREAS_DATA } from "../constants/areas.constants";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

export default function UsersPage() {
  const {
    isModalOpen,
    currentUser,
    users,
    isProcessing,
    showDeleted,
    newUserKey,
    setNewUserKey,
    handleNewUserClick,
    handleViewUser,
    handleDeleteUser,
    handleSaveUser,
    closeModal,
    handleToggleView,
  } = useUsers();

  const { searchTerm, filteredUsers, handleSearchChange } = useUserSearch(users);

  // Función helper para obtener la descripción del área
  const getAreaDescription = (areaCode: string): string => {
    const area = AREAS_DATA.find(a => a.codigo === areaCode);
    return area ? area.descripcion : areaCode; // Si no encuentra, muestra el código
  };

  return (
    <div className="p-8 bg-[#fcfcfc] min-h-full">
      {/* Encabezado de Página */}
      <div className="mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black uppercase">
            Gestión de <span className="text-red-600">{showDeleted ? 'Usuarios Eliminados' : 'Usuarios'}</span>
          </h1>
        </div>
      </div>

      {/* Sección de Acciones: Botón y Búsqueda */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 relative w-1/2 max-w-md">
          <div className="flex relative w-full">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar usuarios por nombres y apellidos"
              className="block w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-red-600/10 transition-all focus:border-red-600 focus:bg-white focus:ring-4"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>
          <button
            onClick={handleToggleView}
            title={showDeleted ? 'Ver usuarios activos' : 'Ver usuarios eliminados'}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors cursor-pointer whitespace-nowrap text-xs font-bold uppercase tracking-wider ${
              showDeleted
                ? 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
                : 'text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Search size={16} />
            {showDeleted ? 'Activos' : 'Eliminados'}
          </button>
        </div>
        <div className="flex">
          <button
            onClick={() => {
              setNewUserKey(prev => prev + 1);
              handleNewUserClick();
            }}
            disabled={showDeleted}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-colors cursor-pointer ${
              showDeleted
                ? 'text-slate-400 border border-slate-200 opacity-50 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <UserPlus size={20} />
            Nuevo
          </button>
        </div>
      </div>


      {/* Contenedor de Tabla */}
      <div className="overflow-hidden  border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <Table className="min-w-full text-sm">
          <TableCaption className="text-left text-sm text-slate-500 px-6 py-4">
            {showDeleted ? 'Usuarios eliminados del sistema' : 'Usuarios registrados y estado de su cuenta'}
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-950 text-white border-b border-slate-200/70">
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Nombres
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Apellidos
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Área
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Correo
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Teléfono
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Estado
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow className="group bg-white transition-colors hover:bg-slate-50">
                <TableCell colSpan={7} className="py-24 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck size={48} className="text-slate-300" />
                    <p className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {searchTerm ? 'No se encontraron usuarios' : showDeleted ? 'Sin usuarios eliminados' : 'Bandeja de usuarios vacía'}
                    </p>
                    <p className="max-w-xl text-xs leading-5 text-slate-500">
                      {searchTerm
                        ? 'No hay usuarios que coincidan con tu búsqueda. Intenta con otros términos.'
                        : showDeleted
                        ? 'No hay usuarios eliminados. Presiona "Activos" para ver los usuarios registrados.'
                        : 'No hay registros disponibles para mostrar. Presiona "Nuevo" para agregar un usuario al sistema.'
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((userItem, index) => (
                <TableRow key={`${userItem.email}-${index}`} className="group bg-white transition-colors hover:bg-slate-50">
                  <TableCell className="px-6 py-4 text-slate-700">{userItem.nombres}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{userItem.apellidos}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{getAreaDescription(userItem.area)}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{userItem.email}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{userItem.telefono}</TableCell>
                  <TableCell className="px-6 py-4 text-center text-slate-700">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${userItem.status ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {userItem.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-slate-700">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewUser(userItem)}
                        title="Ver detalle"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(userItem)}
                        title="Eliminar usuario"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserForm
        key={isModalOpen ? (currentUser ? currentUser.email : `new-${newUserKey}`) : 'closed'}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveUser}
        initialData={currentUser}
        isProcessing={isProcessing}
      />
    </div>
  )
}
