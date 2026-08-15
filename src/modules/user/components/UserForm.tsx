import React, { useRef, useEffect } from 'react';
import type { UserFormProps } from '../types/UserForm.types';
import { useUserForm } from '../hooks/useUserForm';
import { AREAS_DATA } from '../constants/areas.constants';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

export default function UserForm({ isOpen, onClose, onSubmit, initialData, isProcessing }: UserFormProps) {
  const {
    nombres, setNombres, apellidos, setApellidos, email, setEmail,
    telefono, setTelefono, area, setArea, user, setUser, contrasena, setContrasena,
    isEmailValid, isFormValid
  } = useUserForm(initialData, isOpen);

  // Referencias para el control del foco
  const nombresRef = useRef<HTMLInputElement>(null);
  const apellidosRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLButtonElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const contrasenaRef = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  // Forzar foco en el primer campo al abrir
  useEffect(() => {
    if (isOpen) {
      // Un pequeño delay asegura que el Dialog esté renderizado en el DOM
      setTimeout(() => nombresRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      const normalizedPhone = telefono.replace(/\D/g, '');
      onSubmit({ nombres, apellidos, email, telefono: normalizedPhone, area, user, password: contrasena });
    }
  };

  // Tipado genérico para navegación con Enter
  const handleKeyDown = (
    e: React.KeyboardEvent,
    nextRef: { current: HTMLElement | null }
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation(); // Detenemos la propagación para evitar que el Select abra el dropdown
      nextRef.current?.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border-none bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight text-zinc-1000 uppercase">
            {initialData ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs">
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="nombres" className="text-xs font-bold uppercase tracking-widest text-zinc-800 ml-1">Nombres</Label>
            <Input
              ref={nombresRef}
              type="text"
              id="nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, apellidosRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="apellidos" className="text-xs font-bold uppercase tracking-widest text-zinc-800 ml-1">Apellidos</Label>
            <Input
              ref={apellidosRef}
              type="text"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-800 ml-1">Email</Label>
            <Input
              ref={emailRef}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, telefonoRef)}
              className={`rounded-xl ${!isEmailValid && email !== '' ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-red-600'} bg-white focus:ring-red-600/10 h-9`}
              required
            />
            {!isEmailValid && email !== '' && (
              <p className="text-[10px] text-red-500 ml-1 font-bold uppercase tracking-tighter">Email inválido</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefono" className="text-xs font-bold uppercase tracking-widest text-zinc-800 ml-1">Teléfono</Label>
            <Input
              ref={telefonoRef}
              type="text"
              inputMode="numeric"
              id="telefono"
              value={telefono}
              maxLength={11}
              onChange={(e) => setTelefono(formatPhoneNumber(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, areaRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              placeholder="123 456 789"
              required
            />
            {telefono !== '' && telefono.replace(/\D/g, '').length !== 9 && (
              <p className="text-[10px] text-red-500 ml-1 font-bold uppercase tracking-tighter">El teléfono debe tener 9 dígitos</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="area" className="text-xs font-bold uppercase tracking-widest text-zinc-800 ml-1">Área</Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger 
                ref={areaRef}
                id="area" 
                className="w-full rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-10 data-placeholder:text-zinc-400"
                onKeyDown={(e) => handleKeyDown(e, userRef)}
              >
                <SelectValue placeholder="Seleccione un área" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 bg-white opacity-100 shadow-xl z-50">
                {AREAS_DATA.map((a) => (
                  <SelectItem 
                    key={a.codigo} 
                    value={a.codigo} 
                    className="text-sm focus:bg-zinc-100 focus:text-zinc-900 cursor-pointer transition-colors"
                  >
                    {a.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="user" className="text-xs font-bold uppercase tracking-widest text-zinc-800 ml-1">Usuario</Label>
            <Input
              ref={userRef}
              type="text"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, contrasenaRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="contrasena" className="text-xs font-bold uppercase tracking-widest text-zinc-800 ml-1">Contraseña</Label>
            <Input
              ref={contrasenaRef}
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, submitBtnRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="rounded-xl border-zinc-200 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-zinc-50 active:scale-95 h-10"
            >
              Cancelar
            </Button>
            <Button
              ref={submitBtnRef}
              type="submit"
              disabled={!isFormValid || isProcessing}
              className="rounded-xl bg-red-600 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-red-600/40 active:scale-95 disabled:opacity-30 h-10 w-25 px-8"
            >
              {isProcessing ? (initialData ? 'Actualizando...' : 'Guardando...') : (initialData ? 'Actualizar' : 'Guardar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
