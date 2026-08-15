import React, { useRef, useEffect } from "react";
import type { CentroCostoFromProps } from "../types/centercost.type";
import { useCenterCostForm } from "../hooks/useCenterCostForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CenterCostFrom({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isProcessing,
  selectedCustomer,
}: CentroCostoFromProps) {
  const {
    descripcion,
    setDescripcion,
    contacto,
    setContacto,
    email,
    setEmail,
    telefono,
    setTelefono,
    user,
    setUser,
    password,
    setPassword,
    isEmailValid,
    isFormValid,
  } = useCenterCostForm(initialData);

  const descripcionRef = useRef<HTMLInputElement>(null);
  const contactoRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => descripcionRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      const normalizedPhone = telefono.replace(/\D/g, "");
      onSubmit({
        descripcion,
        cliente: selectedCustomer,
        status: true,
        contacto,
        email,
        telefono: normalizedPhone,
        user,
        password,
      });
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    nextRef: { current: HTMLElement | null },
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      nextRef.current?.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border-none bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight text-zinc-1000 uppercase">
            {initialData ? "Editar Centro de Costo" : "Nuevo Centro de Costo"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs">
            Cliente seleccionado: <span className="font-bold text-zinc-700">{selectedCustomer}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="descripcion" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Descripción
            </Label>
            <Input
              ref={descripcionRef}
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, contactoRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="contacto" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Contacto
            </Label>
            <Input
              ref={contactoRef}
              type="text"
              id="contacto"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Email
            </Label>
            <Input
              ref={emailRef}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, telefonoRef)}
              className={`rounded-xl ${!isEmailValid && email !== "" ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-red-600"} bg-white focus:ring-red-600/10 h-9`}
              required
            />
            {!isEmailValid && email !== "" && (
              <p className="text-[10px] text-red-500 ml-1 font-bold uppercase tracking-tighter">Email inválido</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefono" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Teléfono
            </Label>
            <Input
              ref={telefonoRef}
              type="text"
              inputMode="numeric"
              id="telefono"
              value={telefono}
              maxLength={11}
              onChange={(e) => setTelefono(formatPhoneNumber(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, userRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              placeholder="123 456 789"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="user" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                Usuario
              </Label>
              <Input
                ref={userRef}
                type="text"
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                Contraseña
              </Label>
              <Input
                ref={passwordRef}
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, submitBtnRef)}
                className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
                required
              />
            </div>
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
              {isProcessing ? (initialData ? "Actualizando..." : "Guardando...") : (initialData ? "Actualizar" : "Guardar")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
